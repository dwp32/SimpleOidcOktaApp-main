
require("./secrets");
const OktaAuth = require('@okta/okta-auth-js').OktaAuth;
// const getUserToken = require("./getUserToken");

async function init()
{


   // if (!global.authClient)
   // {
   //    // await loadParams();
   //    let config =
   //    {
   //       // Required config
   //       issuer: 'https://ces-ensign-dev.oktapreview.com/oauth2/default',
   //       clientId: process.env.INST_CLIENT_ID,
   //       redirectUri: 'http://localhost:3000/palSuccess',
   //
   //       // Use authorization_code flow
   //       responseType: 'code',
   //       pkce: false//,pe:
   //       // prompt: "none"
   //    };
   //
   //    global.authClient = new OktaAuth(config);
   //    console.log("End of authClient init.");
   // }

   /*
   import {
      OktaAuth,
      OktaAuthOptions,
      TokenManagerInterface,
      AccessToken,
      IDToken,
      UserClaims,
      TokenParams
   } from '@okta/okta-auth-js';

   const config: OktaAuthOptions = {
      issuer: 'https://{yourOktaDomain}'
   };

   const authClient: OktaAuth = new OktaAuth(config);
   const tokenManager: TokenManagerInterface = authClient.tokenManager;
   const accessToken: AccessToken = await tokenManager.get('accessToken') as AccessToken;
   const idToken: IDToken = await tokenManager.get('idToken') as IDToken;
   const userInfo: UserClaims = await authClient.token.getUserInfo(accessToken, idToken);

   if (!userInfo) {
      const tokenParams: TokenParams = {
         scopes: ['openid', 'email', 'custom_scope'],
      };
      authClient.token.getWithRedirect(tokenParams);
   }
   */
   // const tokenManager = global.authClient.tokenManager;
   // const accessToken: AccessToken = await tokenManager.get('accessToken') as AccessToken;

   // import {
   //    OktaAuth,
   //    OktaAuthOptions,
   //    TokenManagerInterface,
   //    AccessToken,
   //    IDToken,
   //    UserClaims,
   //    TokenParams
   // } from '@okta/okta-auth-js';
// const
//    const config: OktaAuthOptions = {
//       issuer: 'https://{yourOktaDomain}'
//    };

   // const tokenManager = global.authClient.tokenManager;
   // const accessToken = await tokenManager.get('accessToken');
   // const idToken = await tokenManager.get('idToken');
   //
   // console.log("Access token:");
   // console.log(accessToken);
   // console.log("ID token:");
   // console.log(idToken);
}

module.exports = init;