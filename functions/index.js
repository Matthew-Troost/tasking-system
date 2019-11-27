/* eslint-disable promise/no-nesting */
const functions = require("firebase-functions")
const admin = require("firebase-admin")
var bugsnag = require("@bugsnag/js")
var bugsnagClient = bugsnag("0cc7797bde148de26b6bb54bfd4f1f18")
const ImapClient = require("emailjs-imap-client")

admin.initializeApp()

function monitorSupportAccount() {
  var client = new ImapClient.default("mail.netgen.co.za", 143, {
    auth: {
      user: "support@netgen.co.za",
      pass: "358#soS1"
    },
    useSecureTransport: false,
    ignoreTLS: true
  })

  client
    .connect()
    .then(() => {
      return client
        .listMailboxes()
        .then(mailboxes => {
          return bugsnagClient.notify(
            mailboxes.children.filter(box => {
              return box.name === "INBOX"
            }).length
          )
        })
        .catch(error => {
          return bugsnagClient.notify(mailboxes)
        })
    })
    .catch(error => {
      return bugsnagClient.notify(error)
    })
}

//this is a temporary endpoint - ideally we would create a schulded function to monitor the account but this requires the Blaze plan
exports.receiveTicket = functions.https.onRequest(async (request, response) => {
  monitorSupportAccount()

  //   const snapshot = admin
  //     .firestore()
  //     .collection("tickets")
  //     .add(request.body)

  return response.status(200)
})
