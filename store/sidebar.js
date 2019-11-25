export const state = () => ({
  open: true
})

export const getters = {
  isOpen: state => {
    return state.open
  }
}

export const mutations = {
  toggleOpen(state) {
    state.open = !state.open
  }
}
