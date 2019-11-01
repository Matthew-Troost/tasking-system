import firebase from "../services/firebase"

export const state = () => ({
  firebase: firebase,
  db: firebase.firestore(),
  auth: firebase.auth(),
  storage: firebase.storage()
})

export const strict = false
