import firebase from "../services/firebase"
// const ballsCollection = firebase.firestore().collection("balls")

// ballsCollection.onSnapshot(ballsRef => {
//   const balls = []

//   ballsRef.forEach(doc => {
//     const ball = doc.data()
//     ball.id = doc.id
//     balls.push(ball)
//   })

//   state.list = balls
// })

export const state = () => ({
  current_user: null
})

export const getters = {
  current_user: state => {
    return state.current_user
  }
}

export const mutations = {
  setCurrentUser(state, { user }) {
    state.current_user = user
  }
}

// actions commit mutations i.e they perform mutations asynchronously
export const actions = {
  register_with_email(context, payload) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          function(user) {
            resolve(user)
          },
          function(error) {
            reject(error)
          }
        )
    })
  },
  login(context, payload) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          function(user) {
            //  context.commit("setCurrentUser", user)
            resolve(user)
          },
          function(error) {
            reject(error)
          }
        )
    })
  },
  logout() {
    firebase.auth().signOut()
    // context.commit("setCurrentUser", null)
  }
}
