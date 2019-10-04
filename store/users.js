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
  list: []
})

export const mutations = {}

// actions commit mutations i.e they perform mutations asynchronously
export const actions = {
  register(context, email, password) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
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
  login(context, email, password) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          function(user) {
            resolve(user)
          },
          function(error) {
            reject(error)
          }
        )
    })
  }
}
