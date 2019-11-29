import * as firebase from "firebase/app"

export default context => {
  const { store } = context

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
