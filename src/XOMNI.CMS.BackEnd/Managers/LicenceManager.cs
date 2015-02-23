using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using XOMNI.SDK.Master;

namespace XOMNI.CMS.BackEnd.Managers
{
    public class LicenceManager : ILicenceManager
    {
        private MasterAPIClientContext MasterAPIClientContext;
        public LicenceManager(MasterAPIClientContext masterAPIClientContext)
        {
            this.MasterAPIClientContext = masterAPIClientContext;
        }

        public Task<int> GetAsync(string tenantName)
        {
            var licenceClient = MasterAPIClientContext.GetLicenceManagementClient();
            return licenceClient.GetLicenceCapAsync(tenantName);
        }
    }
}