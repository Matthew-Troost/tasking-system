export const state = () => ({
  all: []
})

export const mutations = {
  setProjects(state, { projectList }) {
    state.all = projectList
  }
}

export const actions = {
  async getAll(context) {
    context.rootState.db.collection("projects").onSnapshot(projects => {
      if (projects && projects.docs) {
        let projectList = []
        projects.docs.forEach(project =>
          projectList.push({ ...project.data(), id: project.id })
        )
        context.commit("setProjects", {
          projectList
        })
      }
    })
  }
}
