/* eslint-disable promise/no-nesting */
const functions = require("firebase-functions")
const admin = require("firebase-admin")
const config = {
  apiKey: "AIzaSyAY-OhmSvC91LV2wOZoSsBygb74K3kt6rY",
  authDomain: "steve-eaa4c.firebaseapp.com",
  databaseURL: "https://steve-eaa4c.firebaseio.com",
  projectId: "steve-eaa4c",
  storageBucket: "steve-eaa4c.appspot.com",
  messagingSenderId: "285574746273",
  appId: "1:285574746273:web:25d57a694b5a44adca60e0"
}
admin.initializeApp(config)
const db = admin.firestore()
const storage = admin.storage()
const auth = admin.auth()

// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
exports.saveAvatar = functions.https.onRequest(async (req, res) => {
  storage
    .ref("/UserAvatars/" + req.avatar.name)
    .put(req.avatar)
    .then(() => {
      storage
        .ref("/UserAvatars/" + req.avatar.name)
        .getDownloadURL()
        .then(url => {
          db.collection("users").add({
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            nickname: req.user.nickname,
            type: req.user.type,
            roles: req.user.roles || ["User"],
            avatar: url,
            uid: req.user.uid,
            email: req.user.email
          })
          return true
        })
        .catch(error => {
          res(error)
        })
      return true
    })
    .catch(error => {
      res(error)
    })
  res(true)
})

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
// exports.test = functions.firestore
//   .document("/projects/{projectId}")
//   .onUpdate((change, context) => {
//     // Grab the current value of what was written to the Realtime Database.
//     const uppercase = change.after.data().name.toUpperCase()
//     db.collection("projects")
//       .where("name", "==", change.after.data().name)
//       .get()
//       .then(snapshot => {
//         snapshot.ref.child("name").set(uppercase)
//         return true
//       })
//       .catch(err => {
//         return err
//       })
//   })

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
