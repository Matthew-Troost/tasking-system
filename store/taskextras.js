export const state = () => ({
  all: []
})

export const getters = {
  getForTask: state => taskid => {
    return state.all.find(extras => {
      return extras.taskidentifier == taskid
    })
  }
}

export const mutations = {
  setExtras(state, { extrasList }) {
    state.all = extrasList
  }
}

export const actions = {
  async getAll(context) {
    context.rootState.db.collection("taskextras").onSnapshot(taskextras => {
      if (taskextras && taskextras.docs) {
        let extrasList = []
        taskextras.docs.forEach(extras =>
          extrasList.push({ ...extras.data(), id: extras.id })
        )
        context.commit("setExtras", {
          extrasList
        })
      }
    })
  }
}
