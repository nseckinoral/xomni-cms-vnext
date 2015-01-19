using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XOMNI.CMS.BackEnd.Controllers;
using XOMNI.CMS.BackEnd.Managers;

namespace XOMNI.CMS.BackEnd.Tests.Managers
{
    [TestClass]
    public class NavigationManagerFixture
    {
        [TestMethod]
        public async Task GetTest()
        {
            using (var sqlConnection = new SqlConnection(@"Server=.\SQL12; Initial Catalog=XOMNI.CMS.Debug; Integrated Security=True;"))
            {
                var menuItems = await (new NavigationManager(sqlConnection).GetAsync(2));           
            }
        }
    }
}
