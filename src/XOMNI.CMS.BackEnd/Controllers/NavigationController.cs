using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using XOMNI.CMS.BackEnd.Model;
using XOMNI.CMS.BackEnd.Managers;

namespace XOMNI.CMS.BackEnd.Controllers
{
    public class NavigationController : ApiController
    {
        protected INavigationManager NavigationManager;

        public NavigationController(INavigationManager navigationManager)
        {
            this.NavigationManager = navigationManager;
        }
        
        public Task<IEnumerable<MenuItem>> GetAsync(int userRightId)
        {
            return NavigationManager.GetAsync(userRightId);   
        }
    }
}
