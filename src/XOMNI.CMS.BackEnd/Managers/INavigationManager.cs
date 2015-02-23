using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XOMNI.CMS.BackEnd.Model;

namespace XOMNI.CMS.BackEnd.Managers
{
    public interface INavigationManager
    {
        Task<IEnumerable<MenuItem>> GetAsync(int userRightId, string hostUrl);
    }
}
