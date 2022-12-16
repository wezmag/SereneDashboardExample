using Serenity.Services;
using MyRequest = Serenity.Services.SaveRequest<DashboardSample.Administration.LanguageRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = DashboardSample.Administration.LanguageRow;


namespace DashboardSample.Administration
{
    public interface ILanguageSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse> { }
    public class LanguageSaveHandler : SaveRequestHandler<MyRow, MyRequest, MyResponse>, ILanguageSaveHandler
    {
        public LanguageSaveHandler(IRequestContext context)
             : base(context)
        {
        }
    }
}