export const state = () => ({
  all: []
})

export const mutations = {
  setProject(state, { project }) {
    state.all = {
      ...state.all,
      [project.id]: { ...project.data(), id: project.id }
    }
  }
}

export const actions = {
  insert(context, payload) {
    let projectsRef = context.rootState.db.collection("projects")
    projectsRef.add(payload.project)
  },
  update(context, payload) {
    let projectRef = context.rootState.db
      .collection("projects")
      .doc(payload.project.id)

    projectRef.update(payload.project)
  },
  async get(context, payload) {
    return new Promise((resolve, reject) => {
      let projectRef = context.rootState.db
        .collection("projects")
        .where("name", "==", payload.projectName)
        .limit(1)

      projectRef
        .get()
        .then(doc => {
          if (doc.docs.length > 0) {
            resolve(doc.docs[0].data())
          } else {
            resolve("Project does not exist.")
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  async getAll(context) {
    let projectsRef = context.rootState.db.collection("projects")
    let projects = await projectsRef.get()

    projects.forEach(project => context.commit("setProject", { project }))
  }
}
