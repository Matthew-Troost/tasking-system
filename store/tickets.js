export const state = () => ({
  all: []
})

export const getters = {
  getUnassigned: state => {
    return state.all.filter(ticket => {
      return ticket.projectId == ""
    })
  }
}

export const mutations = {
  setTickets(state, { ticketList }) {
    state.all = ticketList
  }
}

export const actions = {
  async getAll(context) {
    context.rootState.db.collection("tickets").onSnapshot(tickets => {
      if (tickets && tickets.docs) {
        let ticketList = []
        tickets.docs.forEach(ticket =>
          ticketList.push({ ...ticket.data(), id: ticket.id })
        )
        context.commit("setTickets", {
          ticketList
        })
      }
    })
  }
}
