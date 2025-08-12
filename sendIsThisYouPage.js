
const POST_URI = "";

function sendIsThisYouPage(resp, data)
{
   let page = "<html><head>";
   page += "<script>function noButton()";
   page += "{ console.log(\"'No' button pushed!\"); }</script>";
   page += "<script>function yesButton()";
   page += "{ console.log(\"'Yes' button pushed!\"); }</script>";
   page += "</head><body><div style='text-align: center'>";
   page += "<h1>Is this you?</h1><h2>" + data.name + "</h2><br /><br />";
   console.log(data);


   // "NO" button performs the multi-Okta log-out process.
   page += '<button type="submit" onclick="logout()">No</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

   // "YES" button sends you to the PAC.
   page += "<button>Yes</button>";

/*
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


   page += "</div>";
   page += "<script>function logout() {" +
      "let ces_logout_url = `https://" + process.env.CES_CUSTOM_URL + "/login/signout`;" +
      // "let ces_logout_url = 'http://localhost:3000/pal';" +
      "console.log('NOW Doing PAL logout redirect!', encodeURI(ces_logout_url));" +
      "window.location.replace(encodeURI(ces_logout_url))}</script>";
   page +="</body></html>";

   resp.send(page);
}

module.exports = sendIsThisYouPage;