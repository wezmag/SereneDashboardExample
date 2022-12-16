using Serenity.Services;
using MyRequest = DashboardSample.Administration.UserListRequest;
using MyResponse = Serenity.Services.ListResponse<DashboardSample.Administration.UserRow>;
using MyRow = DashboardSample.Administration.UserRow;

namespace DashboardSample.Administration
{
    public interface IUserListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

    public class UserListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, IUserListHandler
    {
        public UserListHandler(IRequestContext context)
             : base(context)
        {
        }
    }
}