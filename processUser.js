
const secrets= require('./secrets');
const getOktaId = require('./getOktaId');
const sendIsThisYouPage = require('./sendIsThisYouPage');
//&redirect_uri=undefined&state=pic
async function processUser(req, resp)
{
   // Parse the request data.  Wrap it in a 'try' block to enable graceful
   // failure if something is weird.
   try
   {
      let data = {};

      // Get only the query string portion of the url, starting after the "?".
      let querystring = req.url.substring(req.url.indexOf("?") + 1);

      // This section parses the properties and their values from the query
      // string and sets them in the data object.
      // The two properties expected are "code" and "state".
      let nextIndex = 0; // Start at the beginning of the string.
      do
      {
         // Find the "=" that separates the property name from the value.
         let equal = querystring.indexOf("=", nextIndex);

         // Extract just the property name, from the index to the equal sign.
         let prop = querystring.substring(nextIndex, equal);

         // Find the "&", indicating that there is another property to parse.
         let amp = querystring.indexOf("&", equal + 1);

         // Extract the value.  If there is no "&" after it, then just extract
         // the substring to the end of the string.  If there IS another "&",
         // then only extract the substring to the ampersand.
         let value;
         if (amp === -1)
         {
            value = querystring.substring(equal + 1);
         }
         else
         {
            value = querystring.substring(equal + 1, amp);
         }

         // Assign the parsed property and value to the data object.
         data[prop] = value;

         // The next property index is the position after the "&".  If no "&"
         // was found, then the value of "amp" is -1, so adding one to it will
         // result in a value of 0, which is why the while is greater than 0.
         nextIndex = amp + 1;
      } while (nextIndex > 0)

      if (await getOktaId(data))
      {
         sendIsThisYouPage(resp, data);
         console.log(`Successfully logged in: ${data}`);
      }
   }
   // Something died, and we know not what.
   catch (e)
   {
      console.log("ERROR in processUser.js: " + e);
      console.log("Attempted URL: " + req.url);
   }
}

module.exports = processUser;