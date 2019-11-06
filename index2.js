const { Credentials }  = require("uport-credentials")
const jwtDecode = require('jwt-decode');
const express = require('express')
// issue attestation
// in an express application
const { transport } = require("uport-transports")
const message = require('uport-transports').message.util
const config = require('./config')
const user = require('./user')
const appInfo = require('./user')

// // init creds
// const credentials = new Credentials({
//     appName: 'Fillow',
//     did: 'did:ethr:0x63e3c1efadab1551acc10db6bd09e3f92f146cd8',
//     privateKey: 'ce2686959d7bdeec36bf7adeb499b569b5da395863f2559d4a89d3f98e681ef3'
//   })

// given test creds
const credentials = new Credentials({
  did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
  privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
})


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
  console.log(credentials);
  credentials.createDisclosureRequest({
    requested: ['name'],
    notifications: true,
    callbackUrl: 'http://ac2d14fa.ngrok.io/callback'
  })
  .catch(err => console.log({meth: "createDisclosureRequest", err}))
  .then(requestToken => {
    console.log('request token' , requestToken)
    console.log('decoded token', jwtDecode(requestToken))
    const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
    const qr =  transport.ui.getImageDataURI(uri)
    res.send(`<div><img src="${qr}"/></div>`);
  })
  .catch(err => console.log({meth: "requestToken", err}))
})


app.post("/callback", (req, res) => {
  console.log("I AM HERE IN CALLBACK")
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

app.listen(port, 'localhost', () => console.log(`app listening on port ${port}`));