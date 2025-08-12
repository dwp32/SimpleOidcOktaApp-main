


function postLogoutRedirect(req, resp)
{
   let respText = "<html><body><h1>You have successfully logged out!</h1>";
   respText += "To log in again, please click <a href='localhost:3000'>here</a></body></html>";

   resp.send(respText);
}

module.exports = postLogoutRedirect;