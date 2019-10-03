import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"

var config = {
  apiKey: "yourProjectValueHere",
  authDomain: "yourProjectValueHere",
  databaseURL: "yourProjectValueHere",
  projectId: "yourProjectValueHere",
  storageBucket: "yourProjectValueHere",
  messagingSenderId: "yourProjectValueHere"
}

!firebase.apps.length ? firebase.initializeApp(config) : ""
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()
export default firebase
