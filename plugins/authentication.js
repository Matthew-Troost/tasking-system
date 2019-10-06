import * as firebase from "firebase/app"

export default context => {
  const { store } = context

  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        return resolve(store.commit("users/setCurrentUser", { user }))
      }
      return resolve()
    })
  })
}
