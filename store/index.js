import firebase from "../services/firebase"

export const state = () => ({
  firebase: firebase,
  db: firebase.firestore(),
  auth: firebase.auth()
})

export const strict = false
