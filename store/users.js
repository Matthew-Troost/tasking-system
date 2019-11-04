export const state = () => ({
  current_user: null,
  all: []
})

export const mutations = {
  setCurrentUser(state, { user }) {
    state.current_user = user
  },
  setUsers(state, { usersList }) {
    state.all = usersList
  }
}
export const getters = {
  current_user: state => {
    return state.current_user
  }
}
export const actions = {
  // insert(context, payload) {
  //   let usersRef = context.rootState.db.collection("users")

  //   usersRef.add({
  //     first_name: payload.first_name,
  //     last_name: payload.last_name,
  //     auth_id: payload.auth_id
  //   })
  // },
  async getAll(context) {
    context.rootState.db.collection("users").onSnapshot(users => {
      if (users && users.docs) {
        let usersList = []
        users.docs.forEach(user => {
          usersList.push({ ...user.data(), id: user.id })
        })
        context.commit("setUsers", {
          usersList
        })
      }
    })
  }
  // register(context, payload) {
  //   return new Promise((resolve, reject) => {
  //     context.rootState.auth
  //       .createUserWithEmailAndPassword(payload.email, payload.password)
  //       .then(
  //         function(user) {
  //           context.dispatch("insert", {
  //             first_name: payload.first_name,
  //             last_name: payload.last_name,
  //             auth_id: user.user.uid
  //           })
  //           resolve(user)
  //         },
  //         function(error) {
  //           reject(error)
  //         }
  //       )
  //   })
  // },
  // login(context, payload) {
  //   return new Promise((resolve, reject) => {
  //     context.rootState.auth
  //       .signInWithEmailAndPassword(payload.email, payload.password)
  //       .then(
  //         function(user) {
  //           resolve(user)
  //         },
  //         function(error) {
  //           reject(error)
  //         }
  //       )
  //   })
  // },
  // logout(context) {
  //   context.rootState.auth.signOut()
  //   // context.commit("setCurrentUser", null)
  // }
}
