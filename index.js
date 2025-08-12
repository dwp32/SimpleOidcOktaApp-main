

const redirectToOkta = require('./redirectToOkta');


async function index(req, resp)
{
// console.log(req);
   try
   {
      let data = {};

      if (req.queryStringParameters && req.queryStringParameters.code)
      {
         // The value of the "code" property in the request is the code from
         // Okta to get the access token.
         data.code = req.queryStringParameters.code;

         resp.send("<html><body><h1>Super cool!</h1>This is a page, and you're " +
            "signed in, " + NAMEGOESHERE + "!</body>");
      }
      else
      {
         redirectToOkta(resp);
      }
   }
   catch (e) // If req.queryStringParameters.code;
   {

   }
}

module.exports = index;