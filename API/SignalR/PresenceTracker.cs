namespace API.SignalR
{
    public class PresenceTracker 
    {
        private static Dictionary<string, List<string>> OnlineUsers =
            new Dictionary<string, List<string>>();

        public Task UserConnected(string userName, string connectionId)
        {
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(userName))
                {
                    OnlineUsers[userName].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(userName, new List<string>() { connectionId });
                }
                return Task.CompletedTask;
            }
        }

        public Task UserDisConnected(string userName, string connectionId)
        {
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(userName))
                {
                    return Task.CompletedTask;
                }
                else
                {
                    OnlineUsers[userName].Remove(connectionId);
                    if(OnlineUsers[userName].Count == 0)
                    {
                        OnlineUsers.Remove(userName);
                    }
                }
            }
            return Task.CompletedTask;
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            onlineUsers = OnlineUsers
            .Select(x => x.Key)  
            .OrderBy(key => key)
            .ToArray();

            return Task.FromResult(onlineUsers);
        }

        public Task<List<string>> GetConnectionsForUser(string userName)
        {
            List<string> connectionIds;
            lock (OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(userName);

            }

            return Task.FromResult(connectionIds);
        }
    }
}
