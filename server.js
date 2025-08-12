
// const cesPal = require("./PAL/cesPal");
// const instPal = require("./PAL/instPal");
// const instPlc = require("./PAL/instPlc");
// const cesPlc = require("./PAL/cesPlc");
const index = require('./index');
const processUser = require('./processUser');
const postLogoutRedirect = require('./postLogoutRedirect');

const express = require('express');
const server = express();
const port = 3000;
const secrets = require("./secrets");



/*******************************************************************************
* System flow:
* 1. User browser GETs the root page, which invokes the index function.
* 2. The index page redirects the browser to Okta for user authentication.
* 3. User authenticates, then is redirected to the root via a POST (from Okta).
* 4. The root POST triggers the server to invoke the processUser function.
* 5. The processUser function takes the POST "code" variable and uses it to call
*    the Okta authorization endpoint.
* 6. The response from Okta provides the JWT which is decoded for the ID token.
* 7. Display the "Is this you?" page to the user with the given information.
*
*
*******************************************************************************/


server.get('/', index);
server.get('/logoutRedirect', postLogoutRedirect);   //// SET THIS AS WHAT THE UPPER-LEVEL IDP SHOULD CALL BACK TO!!
server.get('/authorization-code/callback', processUser);
// server.get('/instPal', instPal);
// server.get('/cesPal', cesPal);
// server.get('/cesPlc', cesPlc);
// server.get('/instPlc', instPlc);
//
// /****************************************************************************
//  * This function parses the request body.
//  ****************************************************************************/
// server.use((request, response, next) =>
// {
// console.log(next);
//    if (request.method !== 'POST' ||
//       !(request.headers['content-type'] === 'application/json' ||
//          request.headers['content-type'] === 'application/json; charset=utf-8'))
//    {
// console.log(request.method);
//       // next();
//       response.sendStatus(400);
//       return;
//    }
//
//    // Parse body, capture original string as request.bodyString.
//    let body = [];
//    request.on('data', chunk =>
//    {
//       body.push(chunk);
//    }).on('end', () =>
//    {
//       request.bodyString = Buffer.concat(body).toString();
//       try
//       {
//          request.body = JSON.parse(request.bodyString);
//       }
//       catch (e)
//       {
//          console.log("Something died parsing the JSON request!");
//          response.sendStatus(400);
//          return;
//       }
//       next();
//    });
// });
//
// server.post('/', processUser);


server.listen(port, () => {
   console.log(`Example server listening on port ${port}`)
});