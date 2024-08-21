using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub: Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;

        public MessageHub(  
            IMessageRepository messageRepository,
            IMapper mapper, 
            IUserRepository userRepository,
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker tracker
            )
        {
            this._messageRepository = messageRepository;
            this._mapper = mapper;
            this._userRepository = userRepository;
            this._presenceHub = presenceHub;
            this._tracker = tracker;
        }

        public  override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = this.GetGroupName(Context.User.GetUserName(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group =  await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messges = await _messageRepository.GetMessageThread(Context.User.GetUserName(), otherUser);
            await Clients.Caller.SendAsync("ReceiveMessageThread", messges);// must be same name in client
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(MessageDto createMessageDto)
        {
            var userName = Context.User.GetUserName();

            if (userName.ToLower() == createMessageDto.RecipientUserName.ToLower())
            {
                throw new HubException("In my app you will not send a message to you self");
            }
            else
            {
                var sender = await _userRepository.GetUserByUserNameAsync(userName);
                var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);
                if (sender == null && recipient == null)
                {
                    throw new HubException("not found user and recipient");
                }
                else
                {
                    var message = new Message
                    {
                        Sender = sender,
                        Recipient = recipient,
                        SenderUserame = userName,
                        RecipientUserName = createMessageDto.RecipientUserName,
                        Content = createMessageDto.Content
                    };

                    var groupName = this.GetGroupName(sender.UserName, recipient.UserName);
                    var group = await _messageRepository.GetMessageGroup(groupName);

                    if (group.Connections.Any(x => x.UserName == recipient.UserName))
                    {
                        message.DateRead = DateTime.Now;
                    }
                    else
                    {
                        var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
                        if (connections != null)
                        {
                            await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceied",
                                new { userName = sender.UserName, knowAs = sender.KnowAs });
                        }
                    }

                    _messageRepository.AddMessage(message);
                    var res = await _messageRepository.SaveAllAsync();

                    if (res)
                    {

                        var messageDto = _mapper.Map<MessageDto>(message);
                        await Clients.Group(groupName).SendAsync("NewMessage", messageDto);
                    }
                    else
                    {
                        throw new HubException("issue with add the message");
                    }


                }
            }
        }

        //public async Task SendMessage(MessageDto createMessageDto)
        //{
        //    var userName = Context.User.GetUserName();

        //    if (userName.ToLower() == createMessageDto.RecipientUserName.ToLower())
        //    {
        //        throw new HubException("In my app you will not send a message to yourself");
        //    }

        //    var sender = await _userRepository.GetUserByUserNameAsync(userName);
        //    var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);

        //    if (sender == null || recipient == null)
        //    {
        //        throw new HubException("User not found");
        //    }

        //    var message = new Message
        //    {
        //        Sender = sender,
        //        Recipient = recipient,
        //        SenderUserame = userName,
        //        RecipientUserName = createMessageDto.RecipientUserName,
        //        Content = createMessageDto.Content
        //    };

        //    var groupName = this.GetGroupName(sender.UserName, recipient.UserName);
        //    var group = await _messageRepository.GetMessageGroup(groupName);

        //    // Check if the recipient is online using the PresenceTracker
        //    var recipientConnections = await _tracker.GetConnectionsForUser(recipient.UserName);
        //    if (recipientConnections != null && recipientConnections.Any())
        //    {
        //        message.DateRead = DateTime.Now;
        //    }
        //    else if (group.Connection.Any(x => x.UserName == recipient.UserName))
        //    {
        //        message.DateRead = DateTime.Now;
        //    }
        //    else
        //    {
        //        var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
        //        if (connections != null)
        //        {
        //            await _presenceHub.Clients.Clients(connections)
        //                .SendAsync("NewMessageReceived",
        //               new { userName = sender.UserName, knowAs = sender.KnowAs });
        //        }
        //    }

        //    _messageRepository.AddMessage(message);
        //    if (await _messageRepository.SaveAllAsync())
        //    {
        //        var messageDto = _mapper.Map<MessageDto>(message);
        //        await Clients.Group(groupName).SendAsync("NewMessage", messageDto);
        //    }
        //    else
        //    {
        //        throw new HubException("Failed to send message");
        //    }
        //}


        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUserName());

            if (group == null)
            {
                group = new Group(groupName);
                _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await _messageRepository.SaveAllAsync())
            {
                return group;
            }
            else
            {
                throw new HubException("Failed to join group");
            }
        }


        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _messageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId); 
             _messageRepository.RemoveConnection(connection);
            if(await _messageRepository.SaveAllAsync())
            {
                return group;
            }
            else
            {
                throw new HubException("Faile to remove from group");
            }
        }

        private string GetGroupName(string userName, string other)
        {
            var stringCompre = string.CompareOrdinal(userName, other) < 0;
            return stringCompre ? $"{userName}_{other}" : $"{other}_{userName}";
        }
    }
}
