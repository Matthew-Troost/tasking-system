import * as firebase from "firebase/app"
import ImapClient from "emailjs-imap-client"

export default context => {
  const { store } = context

  var client = new ImapClient("mail.netgen.co.za", 143, {
    auth: {
      user: "support@netgen.co.za",
      pass: "358#soS1"
    },
    useSecureTransport: true,
    requireTLS: true
  })

  client.connect().then(() => {
    console.log("connected")
  })

  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user.emailVerified) {
          store.commit("users/setCurrentUser", { user })
        } else {
          firebase.auth().currentUser.sendEmailVerification()
        }
      }
      return resolve()
    })
  })
}
