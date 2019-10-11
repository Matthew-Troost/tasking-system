export const state = () => ({
  all: []
})

export const mutations = {
  setProject(state, { project }) {
    state.all = { ...state.all, [project.id]: project.data() }
  }
}

export const actions = {
  insert(context, payload) {
    let projectsRef = context.rootState.db.collection("projects")

    projectsRef.add({
      name: payload.name
    })
  },
  async getAll(context) {
    let projectsRef = context.rootState.db.collection("projects")
    let projects = await projectsRef.get()

    projects.forEach(project => context.commit("setProject", { project }))
  }
}
