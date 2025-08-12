
////// This page is ONLY to show how the PLC is generated; it should be the link
////// returned by the PAP via provisioningLink.

async function instPlc(req, resp)
{
   ////// THIS IS A WORKING LINK FOR THE PLC!!! //////

   // Craft the redirect URL.  Okta requires the client_id, scope, redirect_uri,
   // and state parameters.
   let location = "https://" + process.env.INST_CUSTOM_URL +
      "/oauth2/default/v1/authorize?" +
      "client_id=" + process.env.INST_CLIENT_ID +
      "&scope=openid%20profile&response_type=code" +
      "&prompt=none" +
      // The redirect_uri tells Okta where to send the user after they have
      // logged in.  For our flow, they will be federated to the Church, then
      // they will be sent to the PMA lambda which will allow them to set their
      // Okta password.
      // Note: The value for redirect_uri also needs to be set in Okta for the
      // application as a "Sign-in redirect URI".
      "&redirect_uri=" + "http://localhost:3000/instPal" + //process.env.PIC_WEB_ADDR +
      // The state variable is needed for the call to work, but right now we do
      // not use it, so "pma" is the dummy value used.
      "&state=" + "pic";

   //https://okta.ensign.dev/oauth2/default/v1/authorize?client_id=0oaaqekwucZanjznB1d7&scope=openid%20profile&response_type=code&prompt=none&redirect_uri=http://localhost:3000/pal&state=pic




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

module.exports = instPlc;