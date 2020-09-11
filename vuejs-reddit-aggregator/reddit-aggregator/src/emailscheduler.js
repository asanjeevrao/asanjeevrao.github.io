const API_KEY = "416acb1f5c1c400647d64e62664c8396-0f472795-9be51c62";
const DOMAIN = "sandbox161f9ca8b94f4cbbac2b3eeb6afe03e5.mailgun.org";

var mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

var data = {
  from: "Excited User <me@samples.mailgun.org>",
  to: "asanjeevrao@gmail.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomeness!",
};

mailgun.messages().send(data, function(error, body) {
  if (error) console.log("Error " + error);
  else console.log("Success " + body);
});

/*
sendMail = function(sender_email, reciever_email, email_subject, email_body) {
  const data = {
    from: sender_email,
    to: reciever_email,
    subject: email_subject,
    text: email_body,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) console.log(error);
    else console.log(body);
  });
};

var sender_email = "sanjeev@skout.dev";
var receiver_email = "asanjeevrao@gmail.com";
var email_subject = "Mailgun Demo";
var email_body = "Greetings from geeksforgeeks";

// User-defined function to send email
sendMail(sender_email, receiver_email, email_subject, email_body);
*/
