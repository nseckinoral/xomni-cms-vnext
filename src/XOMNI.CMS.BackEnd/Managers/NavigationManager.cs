using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XOMNI.CMS.BackEnd.Model;
using Dapper;

namespace XOMNI.CMS.BackEnd.Managers
{
    public class NavigationManager : INavigationManager, IDisposable
    {
        private SqlConnection SqlConnection;
        private string sql = @"SELECT 
							ParentPage.[Id]
							  ,ParentPage.[Title]
							  ,ParentPage.[Url]
							  ,ParentPage.[Order]
							  ,ParentPage.[ParentPageId]
							  ,ParentPage.[CssClass]
							  ,ParentPage.[MenuGroupId]
							  ,ParentPage.[IsActive] 
                              ,ParentPage.[PointsToNewCMS]
							  ,ChildPage.[Id]
							  ,ChildPage.[Title]
							  ,ChildPage.[Url]
							  ,ChildPage.[Order]
							  ,ChildPage.[ParentPageId]
							  ,ChildPage.[CssClass]
							  ,ChildPage.[MenuGroupId]
							  ,ChildPage.[IsActive] 
                              ,ChildPage.[PointsToNewCMS]
							  ,Mapping.UserRightId
						FROM Pages ParentPage
							INNER JOIN Pages ChildPage ON ChildPage.ParentPageId = ParentPage.Id
							INNER JOIN PageUserRightMapping Mapping ON Mapping.PageId = ParentPage.Id
						WHERE ParentPage.IsActive = 1 
							AND ChildPage.IsActive = 1
							AND Mapping.UserRightId = @userRightId
						ORDER BY 
							ParentPage.[Order], ChildPage.[Order]";
        public NavigationManager(SqlConnection sqlConnection)
        {
            this.SqlConnection = sqlConnection;
        }

        public Task<IEnumerable<MenuItem>> GetAsync(int userRightId, string hostUrl)
        {
            Dictionary<int, MenuItem> lookup = new Dictionary<int, MenuItem>();
            return SqlConnection.QueryAsync<MenuItem, MenuItem, MenuItem>(sql,
                (parentMenuItem, childMenuItem) =>
                {
                    MenuItem menuItem;

                    if (!lookup.TryGetValue(parentMenuItem.Id, out menuItem))
                    {
                        ChangeMenuUrlToAbsolute(parentMenuItem, hostUrl);
                        lookup.Add(parentMenuItem.Id, parentMenuItem);
                        menuItem = parentMenuItem;
                    }

                    ChangeMenuUrlToAbsolute(childMenuItem, hostUrl);
                    menuItem.ChildPages.Add(childMenuItem);
                    childMenuItem.ParentPage = menuItem;

                    return menuItem;
                }
                , new { userRightId = userRightId }
            ).ContinueWith(t =>
            {
                return t.Result.Distinct();
            });
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (SqlConnection != null)
                {
                    SqlConnection.Dispose();
                    SqlConnection = null;
                }
            }
        }

        protected virtual void ChangeMenuUrlToAbsolute(MenuItem menuItem, string hostUrl)
        {
            string baseUrl = new Uri(hostUrl).GetLeftPart(UriPartial.Authority);
            string baseUrlForOldPortal = baseUrl.Replace("vnext", String.Empty);

            if (menuItem.Url != "#")
            {
                if (menuItem.PointsToNewCMS)
                {
                    menuItem.Url = baseUrl + menuItem.Url;
                }
                else
                {
                    menuItem.Url = baseUrlForOldPortal + menuItem.Url;
                }
            }
            else
            {
                menuItem.Url = baseUrl + menuItem.Url;
            }
        }
    }
}
