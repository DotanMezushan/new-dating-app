using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Utils;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;


        public MessagesController(
            DataContext context,
            IConnectionStringProvider connectionStringProvider,
            IUserRepository userRepository,
            IMessageRepository messageRepository,
            IMapper mapper
            ) 
            : base(context, connectionStringProvider)
            {
                this._userRepository = userRepository;
                this._messageRepository = messageRepository;
                this._mapper = mapper;
            }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> createMessage(CreateMessageDto createMessageDto)
        {
            var userName = User.GetUserName();

            if(userName.ToLower() == createMessageDto.RecipientUserName.ToLower())
            {
                return BadRequest("In my app you will not send a message to you self");
            }
            else
            {
                var sender = await  _userRepository.GetUserByUserNameAsync(userName);
                var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);
                if (sender == null && recipient == null) { 
                    return NotFound();
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

                    _messageRepository.AddMessage(message);
                    var res = await _messageRepository.SaveAllAsync();

                    if (res)
                    {
                        var messageDto =  _mapper.Map<MessageDto>(message);
                        return Ok(messageDto);
                    }
                    else
                    {
                        return BadRequest("failed to send message");
                    }
                    

                }
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMessagesForUser([FromQuery]
        MessageParams messageParams)
        {
            messageParams.UserName = User.GetUserName();
            var messages = await _messageRepository.GetMessageForUser(messageParams);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            
            return Ok(messages); 
        }


        [HttpGet("thread/{otheruserName}")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMessageThread(string otheruserName)
        {
            var currentUserName = User.GetUserName();
            return Ok(await _messageRepository.GetMessageThread(currentUserName, otheruserName));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var currentUserName = User.GetUserName();
            var message = await _messageRepository.GetMessage(id);

            if (
                message.Sender.UserName != currentUserName &&
                message.RecipientUserName != currentUserName
                )
                return Unauthorized();
            else
            {
                if (message.Sender.UserName == currentUserName)
                {
                    message.SenderDeleted = true;
                }
                if (message.Recipient.UserName == currentUserName)
                {
                    message.RecipientDeleted = true;
                }

                if (message.SenderDeleted && message.RecipientDeleted)
                {
                    _messageRepository.DeleteMessage(message);
                }

                var res = await _messageRepository.SaveAllAsync();

                if (res)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest("problem deleting the message");
                }
            }



        }
    }
}
