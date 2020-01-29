using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoxCC.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IHttpContextAccessor HttpContextAccessor;

		public UsersController(IHttpContextAccessor httpContextAccessor)
		{
			HttpContextAccessor = httpContextAccessor;
		}

		[HttpGet("[action]")]
		public ActionResult<IIdentity> CurrentUser()
		{
			return new ActionResult<IIdentity>(HttpContextAccessor.HttpContext.User.Identity);
		}
	}
}