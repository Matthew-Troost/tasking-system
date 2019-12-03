export const state = () => ({
  current_user: null,
  all: []
})

export const getters = {
  getCurrentUser: state => {
    return state.all.find(user => {
      return user.uid == state.current_user.uid
    })
  },
  getUserByUID: state => uid => {
    return state.all.find(user => {
      return user.uid == uid
    })
  },
  getUserByFullName: state => fullname => {
    return state.all.find(user => {
      return (
        `${user.first_name.toLowerCase()} ${user.last_name.toLowerCase()}` ==
        fullname.toLowerCase()
      )
    })
  },
  getForRole: state => role => {
    return state.all.filter(user => {
      return user.type.includes(role)
    })
  }
}

export const mutations = {
  setCurrentUser(state, { user }) {
    state.current_user = user
  },
  setUsers(state, { usersList }) {
    state.all = usersList
  }
}

export const actions = {
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
}
