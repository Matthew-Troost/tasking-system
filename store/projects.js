export const state = () => ({
  all: []
})

export const getters = {
  getForUser: state => userid => {
    let projects = []

    state.all.forEach((project, index) => {
      project.lists.forEach(list => {
        list.tasks.forEach(task => {
          if (
            task.users.includes(userid) &&
            !task.completed &&
            !projects.includes(state.all[index])
          ) {
            projects.push(state.all[index])
          }
        })
      })
    })
    return projects
  }
}

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
