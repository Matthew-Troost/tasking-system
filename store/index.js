import firebase from "../services/firebase"

export const state = () => ({
  db: firebase.firestore(),
  auth: firebase.auth()
})

export const strict = false
