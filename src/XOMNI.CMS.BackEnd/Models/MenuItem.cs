using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XOMNI.CMS.BackEnd.Model
{
    public class MenuItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public int Order { get; set; }
        public int? ParentPageId { get; set; }
        public string CssClass { get; set; }
        public int MenuGroupId { get; set; }
        public bool IsActive { get; set; }
        public List<MenuItem> ChildPages { get; set; }
        public MenuItem ParentPage { get; set; }
        public bool PointsToNewCMS { get; set; }
        //public virtual List<ApiUserRight> UserRights { get; set; }

        public MenuItem()
        {
            ChildPages = new List<MenuItem>();
        }
    }
}
