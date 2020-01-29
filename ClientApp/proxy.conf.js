const PROXY_CONFIG = [
  {
    context: [
      "/Fox.Microservices.Customers/api/v1/Customers/",
      "/Fox.Microservices.Customers/api/v1/Diary/"
    ],
    target: "http://sau02ap02foxsit.d09.root.sys",
    secure: false,
    changeOrigin: true
  },

];


module.exports = PROXY_CONFIG;
/*
{
  "/api"
:
  {
    "target"
  :
    "http://sau02ap02foxsit.d09.root.sys",
      "secure"
  :
    false
  }
,
  "changeOrigin"
:
  true
}
*/
