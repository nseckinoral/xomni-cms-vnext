using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using XOMNI.CMS.BackEnd.Managers;

namespace XOMNI.CMS.BackEnd.Controllers
{
    public class LicenceController : ApiController
    {
        protected ILicenceManager LicenceManager;

        public LicenceController(ILicenceManager licenceManager)
        {
            this.LicenceManager = licenceManager;
        }

        public Task<int> GetAsync(string tenantName)
        {
            return LicenceManager.GetAsync(tenantName);
        }
    }
}