// jshint esversion: 6
// jshint esversion: 8

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser({
  urlencoded: true
}));

// Enable the browser to access static files such as css and javascript
app.use(express.static("staticFiles"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//********************************************************************
app.post("/", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

  let data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  let jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/b8d8c881e0";
  const options = {
    method: "POST",
    auth: "ehimze007:01e48ba0509a6c90db52d77678bf7bc1-us7"
  };

  const request = https.request(url, options, function(response) {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();

  app.post("/failure", (req, res) => {
    res.redirect(__dirname + "/");
  });

  // ***************************************************************************
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server started on port " + port);
});


// API Key for authentication
// 11e48ba0509a6c90db52d77678bf7bc1-us7

// serverInstance
// us7

// b8d8c881e0
// List ID
