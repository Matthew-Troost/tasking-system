import firebase from "firebase/app"
import "firebase/firestore"

var config = {
  apiKey: "AIzaSyAY-OhmSvC91LV2wOZoSsBygb74K3kt6rY",
  authDomain: "steve-eaa4c.firebaseapp.com",
  databaseURL: "https://steve-eaa4c.firebaseio.com",
  projectId: "steve-eaa4c",
  storageBucket: "",
  messagingSenderId: "285574746273",
  appId: "1:285574746273:web:25d57a694b5a44adca60e0"
}

firebase.initializeApp(config)

export const state = () => ({
  application_name: "steve."
})

export const mutations = {
  update(state, text) {
    state.application_name = text
  }
}
