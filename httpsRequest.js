/*******************************************************************************
* File: httpsRequest.js
*
* Summary: Executes an HTTPS call based on the options and body passed to it.
*
* ~ Holiness to the Lord ~
*******************************************************************************/

const https = require("https");



/*******************************************************************************
* Function: httpsRequest
*
* Description: Takes the options and requestBody and executes an HTTPS call.
*
* @param options - The options (mainly headers) for the request.
* @param requestBody - A string of the request to be sent.
*
* @returns {Promise<unknown>} - Returns the response or "false" on an error.
*******************************************************************************/
async function httpsRequest(options, requestBody)
{
   // Contact the Okta /token endpoint!
   try
   {
      // WARNING!  WARNING!  WARNING!
      // Do *NOT* remove the following line!  For some reason, the Node.js HTTPS
      // module does not automatically send the length in the header, so we put
      // it here manually in case the system being called requires it.
      options.headers["Content-Length"] =
         Buffer.byteLength(requestBody, 'utf-8');

      // Send the HTTPS request to the endpoint in "options".
      let response = await (new Promise((resolve, reject) =>
      {
         let request = https.request(options, function(res)
         {
            const body = [];

            // Receive each chunk of data from Okta and push it into an array.
            res.on('data', chunk =>
            {
               body.push(chunk);
            })
               // The data received comes as generic hexadecimal and must be
               // converted to a string before it can be parsed and used.
               // Once all of the data has been received, convert it from buffer
               // data to a string, and then parse it as JSON.
               .on('end', () =>
               {
                  let bodyString = Buffer.concat(body).toString();
                  try
                  {
                     // We only need the id_token property from the JSON.
                     resolve(JSON.parse(bodyString));
                  }
                  catch (e)
                  {
                     console.log("ERROR in httpsRequest while parsing bodyString");
                     console.log(e);
                     console.log(requestBody);
                     resolve(false);
                  }
               }); // End of response.on('end') function.
         }); // End of https request function.

         request.on('error', reject);
         request.write(requestBody);
         request.end();
      })); // End of the promise that wraps the HTTPS request.

      return response;
   }
   catch (e)
   {
      console.log("ERROR in httpsRequest.js!");
      console.log(e);
      return false;
   }
}

module.exports = httpsRequest;