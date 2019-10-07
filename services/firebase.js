import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"

var config = {
  apiKey: "AIzaSyAY-OhmSvC91LV2wOZoSsBygb74K3kt6rY",
  authDomain: "steve-eaa4c.firebaseapp.com",
  databaseURL: "https://steve-eaa4c.firebaseio.com",
  projectId: "steve-eaa4c",
  storageBucket: "steve-eaa4c.appspot.com",
  messagingSenderId: "285574746273",
  appId: "1:285574746273:web:25d57a694b5a44adca60e0"
}

!firebase.apps.length ? firebase.initializeApp(config) : ""

firebase.firestore().enablePersistence()

export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const firestore = firebase.firestore()
export default firebase
