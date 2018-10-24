const express = require("express");
const bodyParser = require("body-parser");
const FB = require("fb");

const app = express();

const PORT = process.env.PORT || 3030;
const HOSTNAME = "localhost";
const APPID = "2141894289406132";
const APPSECRET = "6040332d106c126d6edf63a4ae0090bf";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "./public/views"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "pug");
// app.get('*', (req, res, next) => {
//     // FB.getLoginStatus(function(response) {
//     //     console.log("FB login status",response)
//     // })
//     next();
// })
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/views/login.html");
});

app.get("/login", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/views/login.html");
});

app.get("/FBOAuht", (req, res) => {
  if (req.query && req.query.code) {
    FB.api(
      "oauth/access_token",
      {
        client_id: APPID,
        client_secret: APPSECRET,
        redirect_uri: "http://localhost:3030/FBOAuht",
        code: req.query.code
      },
      response => {
        // console.log("FB Token response", response);
        let accesToken = response.access_token;
        let fields =
          "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email";
        FB.api("me", { fields: fields, access_token: accesToken }, fbValues => {
          if (!fbValues.error) {
            console.log("getting the values...", fbValues);
            res.render("home", {
              title: "OAuth 2.0 | Facebook",
              heading: "FaceBook Details",
              profilePicUrl: fbValues.picture.data.url,
              fullName: fbValues.name,
              email: fbValues.email
            });
          } else {
            console.log(
              "Error occured when getting values...",
              fbValues.error.message
            );
            res.render("home", {
              title: "Error",
              heading: fbValues.error.message
            });
          }
        });
      }
    );
  } else if (req.query.error) {
    console.log("error...", req.query.error);
  } else {
    console.log("no clue what hapened");
  }
  //   res.status(200).sendFile(__dirname + "/public/views/home.html");
});

app.listen(PORT, HOSTNAME);
console.log(`Server running on http://${HOSTNAME}:${PORT}`);
