using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Utils;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public async void AddMessage(Message message)
        {
            await _context.Messages.AddAsync(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connection.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups
                .Include(c => c.Connections)
                .Where(c => c.Connections.Any(con => con.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages
                .Include(u => u.Sender)
                .Include(u => u.Recipient)
                .SingleOrDefaultAsync(x => x.Id == id);
                ;
        }

        public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams )
        {
                var query = _context.Messages
                        .OrderByDescending(m => m.MessageSent)
                        .AsQueryable();


                query = messageParams.Container switch
                {
                    "Inbox" => query.Where(u => u.Recipient.UserName == messageParams.UserName && u.RecipientDeleted == false),
                    "Outbox" => query.Where(u => u.Sender.UserName == messageParams.UserName && u.SenderDeleted == false),
                    _ => query.Where(u => u.Recipient.UserName == messageParams.UserName && u.RecipientDeleted == false && u.DateRead == null)
                };

                var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

                return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups
                .Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(m =>
                m.RecipientDeleted == false
                &&  m.Recipient.UserName == currentUserName
                && m.Sender.UserName == recipientUserName
                || m.Recipient.UserName == recipientUserName
                && m.Sender.UserName == currentUserName
                && m.SenderDeleted == false
                )
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadNessages = messages
                .Where(m => m.DateRead == null 
                && m.Recipient.UserName == currentUserName
                ).ToList();
            if (unreadNessages.Any())
            {
                foreach (var message in unreadNessages)
                {
                    message.DateRead = DateTime.Now;
                }

                await _context.SaveChangesAsync();
            }

            var m = _mapper.Map<IEnumerable<MessageDto>>(messages);

            return m;
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connection.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
           return await _context.SaveChangesAsync() > 0;
        }
    }
}
