const { Credentials }  = require("uport-credentials")
const jwtDecode = require('jwt-decode');
const express = require('express')
// issue attestation
// in an express application
const { transport } = require("uport-transports")
const config = require('./config')
const user = require('./user')

// init creds
const credentials = new Credentials(
  {
    appName: 'Login Example',
    ...user
  }, config)

const app = express();
const port = 3000

// path to reload
// important should end with "/" if index.js
var path = __dirname

app.get("/health", (req, res) => {
  res.send("200 ok");
})


// create disclosure request
// in an express application
app.get("/", (req, res) => {
  console.log({credentials});
  credentials.createDisclosureRequest({
    requested: ["name"],
    notifications: true,
    callbackUrl: '10.6.80.202:' + port  + "/callback"
  })
  .catch(err => console.log({meth: "createDisclosureRequest", err}))
  .then(requestToken => {
    console.log(jwt_decode(requestToken))
    const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
    const qr =  transport.ui.getImageDataURI(uri)
    res.send(`<div><img src="${qr}"/></div>`);
  })
  .catch(err => console.log({meth: "requestToken", err}))
})
  
app.post("/callback", (req, res) => {
  console.log("I AM HERE IN CALLBACK")
  const jwt = req.body.access_token
  console.log(jwt)
  // Do something with the jwt --> maybe validate it?
})

app.post("/callback", (req, res) => {
  const jwt = req.body.access_token
  credentials.authenticateDisclosureResponse(jwt).then(creds => {
    const did = creds.did
    const pushToken = creds.pushToken
    const pubEncKey = creds.boxPub
    const push = transport.push.send(pushToken, pubEncKey)
    credentials.createVerification({
      sub: did,
      exp: Time30Days(),
      claim: {
        "My Title" : {
          "KeyOne" : "ValueOne",
          "KeyTwo" : "Value2",
          "Last Key" : "Last Value"
        }
      }
      // Note, the above is a complex claim. Also supported are simple claims:
      // claim: {"Key" : "Value"}
    }).then(att => {
      return push(att)
    })
  })
})

app.listen(port, '10.6.80.202', () => console.log(`app listening on port ${port}`));