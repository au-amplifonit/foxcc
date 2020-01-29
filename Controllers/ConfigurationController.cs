using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FoxCC.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FoxCC.Controllers
{
	[Route("api/[controller]")]
	[Produces("application/json")]
	public class ConfigurationController : ControllerBase
	{
		private readonly IOptions<AngularSettings> AngularSettings;
		public ConfigurationController(IOptions<AngularSettings> angularSettings)
		{
			AngularSettings = angularSettings;
		}

		[HttpGet()]
		public ActionResult<AngularSettings> Get()
		{
			return AngularSettings.Value;
		}
	}
}
