using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;

        public PresenceHub(PresenceTracker tracker)
        {
            this._tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var isOnline =  await _tracker.UserConnected(Context.User.GetUserName(), Context.ConnectionId);
            if (isOnline)
            {
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUserName());// must be same name in client
            }

            var onlineUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", onlineUsers);// must be same name in client
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
             var isOffline =  await _tracker.UserDisConnected(Context.User.GetUserName(), Context.ConnectionId);
            if ((isOffline))
            {
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUserName());// must be same name in client
            }

            await base.OnConnectedAsync();
        }
    }
}
