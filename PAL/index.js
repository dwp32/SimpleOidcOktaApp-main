// const POST_URI = "";
// const init = require("./init");
require("./secrets");

async function index(req, resp)
{
//    curl -v -X POST \
// -H "Accept: application/json" \
// -H "Content-Type: application/json" \
// -H "Authorization: SSWS ${api_token}" \


// GET https://{baseUrl}/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${post_logout_redirect_uri}&state=${state}

   // Entering this "if" statement implies failure. The env vars aren't set.
   if (!process.env.CLIENT_ID || !process.env.PIC_WEB_ADDR ||
       !process.env.CES_CUSTOM_URL)
   {
      console.log("ERROR: Missing parameters in redirectToOkta.js!");
      // let formattedReturn = {};
      // formattedReturn.isBase64Encoded = false;
      // formattedReturn.statusCode = 500;
      // formattedReturn.body = "Internal error";
      // return formattedReturn;
   }


   ////// THIS IS A WORKING LINK FOR THE PLC!!! //////
   //
   // // Craft the redirect URL.  Okta requires the client_id, scope, redirect_uri,
   // // and state parameters.
   // let location = "https://" + process.env.INST_CUSTOM_URL +
   //    "/oauth2/default/v1/authorize?" +
   //    "client_id=" + process.env.INST_CLIENT_ID +
   //    "&scope=openid%20profile&response_type=code" +
   //    "&prompt=none" +
   //    // The redirect_uri tells Okta where to send the user after they have
   //    // logged in.  For our flow, they will be federated to the Church, then
   //    // they will be sent to the PMA lambda which will allow them to set their
   //    // Okta password.
   //    // Note: The value for redirect_uri also needs to be set in Okta for the
   //    // application as a "Sign-in redirect URI".
   //    "&redirect_uri=" + "http://localhost:3000/pal" + //process.env.PIC_WEB_ADDR +
   //    // The state variable is needed for the call to work, but right now we do
   //    // not use it, so "pma" is the dummy value used.
   //    "&state=" + "pic";


   // Craft the redirect URL.  Okta requires the client_id, scope, redirect_uri,
   // and state parameters.
   let location = "https://" + process.env.CES_CUSTOM_URL +
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
      "&redirect_uri=" + "http://localhost:3000/palSuccess" + //process.env.PIC_WEB_ADDR +
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

   // await init();

   // // Subscribe to authState change event.
   // authClient.authStateManager.subscribe(function(authState)
   // {
   //    // Logic based on authState is done here.
   //    if (!authState.isAuthenticated) {
   //       // render unathenticated view
   //       return;
   //    }
   //
   //    // Render authenticated view
   // });
   //
   // // Handle callback
   // if (authClient.token.isLoginRedirect()) {
   //    const { tokens } = await authClient.token.parseFromUrl(); // remember to "await" this async call
   //    authClient.tokenManager.setTokens(tokens);
   // }
   //
   // // normal app startup
   // authClient.start(); // will update auth state and call event listeners
   // let page = "<html><body>You've hit the PAL, pal!</body></html>";
    /*
    Need to FIRST call the /authorize endpoint to get the id_token for the user.


      GET https://{baseUrl}/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${post_logout_redirect_uri}&state=${state}

      baseURL is the URL for your Okta org.
      id_token is the OIDC token issued by Okta during sign on.
      Optional. The post_logout_redirect_uri is the Logout redirect URI where Okta redirects the user after the SLO operation.
      This URI must be listed in the Logout redirect URIs configuration in the General Settings for your Okta integration.
      Optional. The state is any string to be added as parameter upon redirect to the SLO URI.

      Finally, you need to add the Logout redirect URIs to your Okta integration:

      In the Admin Console, go to ApplicationsApplications.
      Click the OIDC application where you want to add SLO.
      In the General settings tab, click Edit.
      Beside the Logout redirect URIs, click + Add URI and enter the post_logout_redirect_uri.
      Click Save.
      To test your SLO flow, sign in to your SP application using the Okta integration, and then use the appropriate sign out
      method from within the SP application. The browser should sign you out of both your SP application and Okta.
   */

   // What WE need to do, is to craft the post_logout_redirect_uri that we will use, which is a redirect to the
   // Church's Okta logout app, but it needs to contain a post_logout_redirect_uri that will send the user back
   // to our sign-in page.  We will most-likely need to URL-encode that property
   // let churchRedirectUri = PAC + params (does "state" automatically get added?);

   // try
   // {
   //    const authClient = getAuthClient(req);
   //    // Get okta signout redirect url
   //    // Call this method before revoke tokens as revocation clears tokens in storage
   //    const signoutRedirectUrl = authClient.getSignOutRedirectUrl();
   //    // Revoke tokens
   //    await authClient.revokeRefreshToken();
   //    await authClient.revokeAccessToken();
   //    // Clear local session
   //    req.session.destroy();
   //    // Clear okta session with logout redirect
   //    res.redirect(signoutRedirectUrl);
   // }
   // catch (err)
   // {
   //    console.log('/logout error: ', err);
   // }
   // page += "</div>";
   // page += "<script>function logout() {" +
   //    "let church_logout_url = `https://" + process.env.CES_CUSTOM_URL + "/login/signout`;" +
   //    "console.log('NOW Doing church logout redirect!', encodeURI(church_logout_url));" +
   //    "window.location.replace(encodeURI(church_logout_url))}</script>";
   // page +="</body></html>";

   // resp.send(page);
}

module.exports = index;