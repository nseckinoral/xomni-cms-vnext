using Autofac;
using Autofac.Integration.WebApi;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using XOMNI.CMS.BackEnd.Managers;
using XOMNI.SDK.Master;

namespace XOMNI.CMS.BackEnd
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Autofac
            var builder = new ContainerBuilder();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterType<NavigationManager>().As<INavigationManager>()
                .InstancePerRequest();
            builder.RegisterType<LicenceManager>().As<ILicenceManager>()
                .InstancePerRequest();
            builder.RegisterType<SqlConnection>().As<SqlConnection>().WithParameter(
                "connectionString",
                ConfigurationManager.ConnectionStrings["cmsDbConnectionString"].ConnectionString)
              .InstancePerRequest();
            builder.RegisterType<MasterAPIClientContext>().As<MasterAPIClientContext>()
                .WithParameter("username", ConfigurationManager.ConnectionStrings["masterAPIUsername"].ConnectionString)
                .WithParameter("password", ConfigurationManager.ConnectionStrings["masterAPIPassword"].ConnectionString)
                .WithParameter("serviceUri", ConfigurationManager.ConnectionStrings["masterAPIUri"].ConnectionString);

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            // Json formatting
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling
                = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

            // Enable CORS
            config.EnableCors(new EnableCorsAttribute("*", "*", "*"));
        }
    }
}
