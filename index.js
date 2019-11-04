const { Credentials }  =  require("uport-credentials")
const express = require('express')
  
// issue attestation
// in an express application
const { transport } = require("uport-transports")
const config = require('./config')

// init creds
const credentials = new Credentials('', config)

const app = express();
const port = 3000


// create disclosure request
// in an express application
app.get("/", () => {
  credentials.createDisclosureRequest({
    notifications: true,
    callbackUrl: "/callback"
  }).then(requestToken => {
    // Do something
  })
})
  
app.post("/callback", (req, res) => {
  const jwt = req.body.access_token
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

app.listen(port, 'localhost', () => console.log(`app listening on port ${port}`));