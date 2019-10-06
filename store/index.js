export const state = () => ({
  application_name: "steve."
})

export const mutations = {
  update(state, text) {
    state.application_name = text
  }
}

export const strict = false
