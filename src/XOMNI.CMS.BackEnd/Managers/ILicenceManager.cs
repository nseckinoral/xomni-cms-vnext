using System.Threading.Tasks;

namespace XOMNI.CMS.BackEnd.Managers
{
    public interface ILicenceManager
    {
        Task<int> GetAsync(string tenantName);
    }
}