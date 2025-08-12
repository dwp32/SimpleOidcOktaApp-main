
const secrets= require('./secrets');

console.log("\nSecrets:");
console.log(secrets.INST_CLIENT_ID);
console.log(secrets.INST_CLIENT_SECRET);
console.log(secrets.INST_CUSTOM_URL);



/*******************************************************************************
* File: getOktaId.js
*
* Summary: Takes the code from the Okta /authorize endpoint and exchanges it for
*          an access_token from Okta.  It then Parses the subject
*          identifier from the JWT and sets the refresh token and Okta ID in the
*          data object.
*
* ~ Holiness to the Lord ~
*******************************************************************************/

let jwt = require('jsonwebtoken');
let httpsRequest = require('./httpsRequest');
//const {INST_CLIENT_ID} = require("./secrets");
console.log(secrets.INST_CLIENT_ID);



/*******************************************************************************
* Function: getOktaId
*
* Description: Takes the code from the Okta /authorize endpoint and calls the
*              /token endpoint.  It then decodes the idToken JWT from the
*              response and returns the Okta subject ID.  If the user previously
*              submitted the HTTP form, it also grabs the refresh token and sets
*              it in the data object.
*
* @param data - The data object from the user POST.
*
* @returns {Promise<boolean>} - "true" if successful, or "false" on an error.
*******************************************************************************/
async function getOktaId (data)
{
   let success = false;

   // Create the string that is used with the /token endpoint.
   console.log(secrets.PIC_WEB_ADDR);
   let requestBody = "grant_type=authorization_code" +
      "&redirect_uri=" + encodeURI(secrets.PIC_WEB_ADDR) +
      // The
      "&code=" + data.code +
      "&scope=openid%20profile" +
      "&client_id=" + secrets.INST_CLIENT_ID +
      "&client_secret=" + secrets.INST_CLIENT_SECRET;

   // Sets up the options for the HTTPS request.
   const options =
   {
      host: secrets.INST_CUSTOM_URL, /// USED TO BE CES
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

      if (tokenResponse.error)
      {
         console.log("ERROR in getOktaId: tokenResponse error returned:");
         console.log(tokenResponse.error);
      }
      else // Successful token returned!
      {
         // Save the ID token; we need this later for SLO.
         data.idToken = tokenResponse.id_token;

         // Decode the JWT and return the Okta subject ID for the user.
         data.oktaObject = jwt.decode(tokenResponse.id_token);

         // JWT decode was successful.
         if (data.oktaObject && data.oktaObject.sub)
         {
            data.name = data.oktaObject.name;
            data.oktaId = data.oktaObject.sub;
            success = true;
         }
         else // There's a problem.
         {
            // Log out the data to figure out why this is occurring.
            console.log("Token response:");
            console.log(tokenResponse);
         }
      }
   }
   catch (e)
   {
      console.log("ERROR in getOktaId.js!");
      console.log(e);
   }

   return success;
}

module.exports = getOktaId;