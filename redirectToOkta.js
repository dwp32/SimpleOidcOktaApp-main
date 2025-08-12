
const secrets = require("./secrets");

/*******************************************************************************
* File: redirectToOkta.js
*
* Summary: Invoked when a user tries to directly access the PMA, this simple
*          file forwards the user to the institution Okta login.  After Okta
*          federates the user to the Church to log in, the redirect will point
*          the user to the PMA Lambda again to set their password.
*
*  ~ Holiness to the Lord ~
*******************************************************************************/



/*******************************************************************************
* Function: redirectToOkta
*
* Description: Produces the HTTP 302 redirect URL with the properties set to
*              allow the user to log into the institution via the CHAIN (with
*              federation to the Church), then redirects to the PMA lambda.
*
*
*
* @returns {*} - The HTTP redirect to the PMA lambda or an HTTP error code.
*******************************************************************************/
async function redirectToOkta(resp)
{
   // // Entering this "if" statement implies failure. The env vars aren't set.
   // if (!process.env.CLIENT_ID || !process.env.PIC_WEB_ADDR ||
   //     !process.env.CES_CUSTOM_URL)
   // {
   //    console.log("ERROR: Missing parameters in redirectToOkta.js!");
   //    let formattedReturn = {};
   //    formattedReturn.isBase64Encoded = false;
   //    formattedReturn.statusCode = 500;
   //    formattedReturn.body = "Internal error";
   //    return formattedReturn;
   // }

   // Craft the redirect URL.  Okta requires the client_id, scope, redirect_uri,
   // and state parameters.
   let location = "https://" + secrets.INST_CUSTOM_URL +
      "/oauth2/default/v1/authorize?" +
      "client_id=" + secrets.INST_CLIENT_ID +
      "&scope=openid%20profile&response_type=code&" +
      // "&prompt=none" +
      // The redirect_uri tells Okta where to send the user after they have
      // logged in.  For our flow, they will be federated to the Church, then
      // they will be sent to the PMA lambda which will allow them to set their
      // Okta password.
      // Note: The value for redirect_uri also needs to be set in Okta for the
      // application as a "Sign-in redirect URI".
      "redirect_uri=" + secrets.PIC_WEB_ADDR +
      // The state variable is needed for the call to work, but right now we do
      // not use it, so "pma" is the dummy value used.
      "&state=" + "pic";

   // The response which tells the caller to redirect to the location.
   let response =
   {
      // There are two common types of redirect: 301 and 302. The description
      // for a 301 is "moved permanently", while the description for a 302 is
      // "found".  The implication is that a 301 will always point to the new
      // location, but a 302 is temporary address.
      // Many systems will cache a 301 redirect. We don't want that since
      // every call to our system will be unique, so we use a 302 HTTP code
      // here.
      statusCode: 302,
      headers:
      {
         Location: location
      }
   };

   // resp.header('Location', location);
   resp.redirect(location);

   return response;
}

module.exports = redirectToOkta;