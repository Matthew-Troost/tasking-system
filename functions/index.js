const functions = require("firebase-functions")
const admin = require("firebase-admin")
var bugsnag = require("@bugsnag/js")
var bugsnagClient = bugsnag("0cc7797bde148de26b6bb54bfd4f1f18")
// const ImapClient = require("emailjs-imap-client")

admin.initializeApp()

// function monitorSupportAccount() {
//   var client = new ImapClient.default("mail.netgen.co.za", 143, {
//     auth: {
//       user: "support@netgen.co.za",
//       pass: "358#soS1"
//     },
//     useSecureTransport: false,
//     ignoreTLS: true
//   })

//   client
//     .connect()
//     .then(() => {
//       return client
//         .listMessages("INBOX", "1:10", ["uid", "flags", "body[]"])
//         .then(messages => {
//           console.log(messages)
//           return bugsnagClient.notify(messages.length)
//         })
//         .catch(error => {
//           return bugsnagClient.notify(mailboxes)
//         })
//     })
//     .catch(error => {
//       return bugsnagClient.notify(error)
//     })
// }

//this is a temporary endpoint - ideally we would create a schulded function to monitor the account but this requires the Blaze plan
exports.receiveTicket = functions.https.onRequest(async (request, response) => {
  console.log("Receiving ticket...")

  var thread = {
    from: request.body.from,
    to: request.body.to,
    cc: request.body.cc,
    subject: request.body.subject,
    html: request.body.html,
    date: admin.firestore.Timestamp.fromDate(new Date(request.body.date))
  }

  await admin
    .firestore()
    .collection("tickets")
    .where("number", "==", request.body.ticketNumber)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log(`Received new ticket - ${request.body.ticketNumber}`)
        admin
          .firestore()
          .collection("tickets")
          .add({
            number: request.body.ticketNumber,
            status: "open",
            thread: [thread]
          })
      } else {
        console.log("Ticket already opened, adding thread")
        admin
          .firestore()
          .collection("tickets")
          .doc(snapshot.docs[0].id)
          .update({
            status: "open",
            thread: admin.firestore.FieldValue.arrayUnion(thread)
          })
      }
      return null
    })
    .catch(err => {
      console.error(err)
    })

  return response.status(200).send()
})
