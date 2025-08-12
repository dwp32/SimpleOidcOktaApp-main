
require("./secrets");
const httpsRequest = require("./httpsRequest");
const parseQueryParams = require('./parseQueryParams');


async function index(req, resp)
{
console.log("Reached the CES PAL.");
   //
   // let page = "<html><body>You made it to the CES PAL!!</body></html>";
   // resp.send(page);

   let queryParams = parseQueryParams(req.url);
// console.log(queryParams);
   // If there was an error in attempting to authenticate the user,
   // then they are not logged in at this level.
   // if (req.queryStringParameters && req.queryStringParameters.error)
   if (queryParams.error)
   {
      console.log("Got an error at the cesPal; user not logged in.");
// console.log(process.env.CES_CUSTOM_URL);
// console.log(process.env.CES_CLIENT_ID);
      // Craft the redirect URL.  Okta requires the client_id, scope, redirect_uri,
      // and state parameters.
      let location = "http://localhost:3000/logoutRedirect" + //process.env.PIC_WEB_ADDR +
         // The state variable is needed for the call to work, but right now we do
         // not use it, so "pma" is the dummy value used.
         "?state=" + queryParams.state;
      // console.log(location);
      //// THE FOLLOWING IS NEEDED FOR AWS.
      // // The response which tells the caller to redirect to the location.
      // let response =
      // {
      //    // There are two common types of redirect: 301 and 302. The description
      //    // for a 301 is "moved permanently", while the description for a 302 is
      //    // "found".  The implication is that a 301 will always point to the new
      //    // location, but a 302 is temporary address.
      //    // Many systems will cache a 301 redirect. We don't want that since
      //    // every call to our system will be unique, so we use a 302 HTTP code
      //    // here.
      //    statusCode: 302,
      //    headers:
      //    {
      //       Location: location
      //    }
      // };
      //
      // return response;
      resp.redirect(location);
   }
      // The presence of a "code" query parameter means that the user is logged in.
      // So log them out!
   // else if (req.queryStringParameters && req.queryStringParameters.code)
   else if (queryParams.code)
   {
console.log("In CES PAL with code parameter; attempting to get ID token.");
      //// Get the ID token ////

      // Create the string that is used with the /token endpoint.
      let requestBody = "client_id=" + process.env.CES_CLIENT_ID +
         "&client_secret=" + process.env.CES_CLIENT_SECRET +
         "&grant_type=authorization_code" +
         "&redirect_uri=" + encodeURI("http://localhost:3000/cesPal") +
         // The
         "&code=" + queryParams.code;

      // Sets up the options for the HTTPS request.
      const options =
      {
         host: process.env.CES_CUSTOM_URL,
         path: "/oauth2/default/v1/token",
         method: 'POST',
         headers:
         {
            'Content-Type': 'application/x-www-form-urlencoded'
         }
      };

      // Contact the Okta /token endpoint!
      try
      {
         // Send the request for the ID token to Okta.
         // If successful, the id_token will be returned.
         let tokenResponse = await httpsRequest(options, requestBody);

         if (tokenResponse.id_token) // Successful token returned!
         {
console.log("Successfully retrieved CES ID token.");
            //// Log the user out of the institution Okta instance ////
            let location = "https://" + process.env.CES_CUSTOM_URL +
               "/oauth2/default/v1/logout?id_token_hint=" + tokenResponse.id_token +
               // Note: The value for redirect_uri also needs to be set in Okta for the
               // application as a "Sign-in redirect URI".
               "&post_logout_redirect_uri=" + encodeURI("http://localhost:3000/logoutRedirect") + //process.env.PIC_WEB_ADDR +
               // The state variable is needed for the call to work, but right now we do
               // not use it, so "pma" is the dummy value used.
               "&state=" + queryParams.state;

            resp.redirect(location);
         }
         else if (tokenResponse.error)
         {
            console.log("ERROR in cesPal: tokenResponse error returned:");
            console.log(tokenResponse.error);
         }
         else
         {
            console.log("Something died in cesPal while getting ID token!!");
         }
      }
      catch (e)
      {
         console.log("FAILURE getting CES ID token!!");
         console.log(e);
      }
   }
   else
   {
      console.log("Baaagh!  Failure in query parameters for cesPal!");
   }
}

module.exports = index;