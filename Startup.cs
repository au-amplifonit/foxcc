using FoxCC.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FoxCC
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.Configure<IISOptions>(options =>
			{
				options.AutomaticAuthentication = true;
			});
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddAuthentication(IISDefaults.AuthenticationScheme);
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
			services.AddOptions();

			// In production, the Angular files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/dist";
			});

			services.Configure<AngularSettings>(Configuration.GetSection("AngularSettings"));
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseAuthentication();
			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseMvc(routes =>
			{
				routes.MapRoute(
									name: "default",
									template: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa(spa =>
			{
							// To learn more about options for serving an Angular SPA from ASP.NET Core,
							// see https://go.microsoft.com/fwlink/?linkid=864501

							spa.Options.SourcePath = "ClientApp";
#if (DEBUG)
				if (env.IsDevelopment())
				{
					spa.UseAngularCliServer(npmScript: "start");
				}
#endif
			});

			app.Use(async (context, next) =>
			{
				var request = context.Request;

				if (request.Path != "/")
				{
					context.Response.Redirect("/" + "?currentRoutePath=" + request.Path);
				}
				else
				{
					await next.Invoke();
				}
			});
		}
	}
}
