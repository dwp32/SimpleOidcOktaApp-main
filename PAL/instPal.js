
// require("./secrets");
const httpsRequest = require("./httpsRequest");
const parseQueryParams = require("./parseQueryParams");


/*
Program flow:
The PAP generates a provisioningLink, which is a link to the Provisioning Login Checker (PLC).
The PLC is nothing more than a link to the Okta OAuth endpoint to see if a user is logged in,
and the redirect is set to the instPal.
The instPal will see if the user is logged in, and if so, it will send the user to the logout
URL, with the redirect_uri set to the CES PLC.  If the user is NOT logged in, then the instPal
will send the user directly to the CES PLC.
The CES PLC will operate exactly as the inst PLC, and sends the user to the CES PAL.
The CES PAL has the redirect URI set to the palSuccess endpoint (the PAC in the real system).
*/



async function index(req, resp)
{
   // Entering this "if" statement implies failure. The env vars aren't set.
   // if (!process.env.CES_CLIENT_ID || !process.env.PIC_WEB_ADDR ||
   //     !process.env.CES_CUSTOM_URL)
   // {
   //    console.log("ERROR: Missing parameters in redirectToOkta.js!");
   //    resp.send(500);
   // }https://oktadev.ceslogin.org/oauth2/default/v1/authorize
   let queryParams = parseQueryParams(req.url);
   let cesPlc = "https://" + process.env.CES_CUSTOM_URL +
      "/oauth2/default/v1/authorize?" +
      "client_id=" + process.env.CES_CLIENT_ID +
      "&scope=openid%20profile&response_type=code" +
      "&prompt=none" +
      // The redirect_uri tells Okta where to send the user after they have
      // logged in.  For our flow, they will be federated to the Church, then
      // they will be sent to the PMA lambda which will allow them to set their
      // Okta password.
      // Note: The value for redirect_uri also needs to be set in Okta for the
      // application as a "Sign-in redirect URI".
      "&redirect_uri=" + encodeURIComponent("http://localhost:3000/cesPal");  //process.env.PIC_WEB_ADDR +
      // The state variable is needed for the call to work, but right now we do
      // not use it, so "pma" is the dummy value used.
      // + "&state=" + queryParams.state;

   // If there was an error in attempting to authenticate the user,
   // then they are not logged in at this level.
   // if (req.queryStringParameters && req.queryStringParameters.error)
   if (queryParams.error)
   {

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

      resp.redirect(cesPlc + "&state=" + queryParams.state);
   }
   // The presence of a "code" query parameter means that the user is logged in.
   // So log them out!
   // else if (req.queryStringParameters && req.queryStringParameters.code)
   else if (queryParams.code)
   {
      //// Get the ID token ////

      // Create the string that is used with the /token endpoint.
      let requestBody = "client_id=" + process.env.INST_CLIENT_ID +
         "&client_secret=" + process.env.INST_CLIENT_SECRET +
         "&grant_type=authorization_code" +
         "&redirect_uri=" + encodeURI("http://localhost:3000/instPal") +
         // The
         "&code=" + queryParams.code;

      // Sets up the options for the HTTPS request.
      const options =
      {
         host: process.env.INST_CUSTOM_URL,
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
            let location = "https://" + process.env.INST_CUSTOM_URL +
               "/oauth2/default/v1/logout?id_token_hint=" + tokenResponse.id_token +
               // Note: The value for redirect_uri also needs to be set in Okta for the
               // application as a "Sign-out redirect URI".
               "&post_logout_redirect_uri=" + encodeURI("http://localhost:3000/cesPlc") + //process.env.PIC_WEB_ADDR +
               // The state variable is needed for the call to work, but right now we do
               // not use it, so "pma" is the dummy value used.
               "&state=" + queryParams.state;

            resp.redirect(location);
         }
         else if (tokenResponse.error)
         {
            console.log("ERROR in instPal: tokenResponse error returned:");
            console.log(tokenResponse.error);
         }
         else
         {
            console.log("Something died in instPal while getting ID token!!");
         }
      }
      catch (e)
      {
         console.log("FAILURE getting inst ID token!!");
         console.log(e);
      }
   }
   else
   {
      console.log("Baaagh!  Failure in query parameters!");
   }
}

module.exports = index;