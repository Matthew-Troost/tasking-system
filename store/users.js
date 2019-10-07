import firebase from "../services/firebase"

export const state = () => ({
  current_user: null,
  users: []
})

const usersCollection = firebase.firestore().collection("users")

usersCollection.onSnapshot(usersRef => {
  const users = []

  usersRef.forEach(doc => {
    users.push(doc.data())
  })

  state.users = users
})

export const getters = {
  current_user: state => {
    return state.current_user
  },
  users: state => {
    return state.users
  }
}

export const mutations = {
  setCurrentUser(state, { user }) {
    state.current_user = user
  },
  addUser(state, { first_name, last_name, auth_id }) {
    state.users.add({
      first_name,
      last_name,
      auth_id
    })
  },
  updateUsers(state, { users }) {
    state.users = users
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
