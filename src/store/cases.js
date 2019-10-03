export default {
  state: {
    cases: []
  },
  getters: {
    cases: state => state.cases
  },
  mutations: {
    addCases: (state, payload) => {
      state.cases = [...payload]
    }
  },
  actions: {
    addCases({ commit }, cases) {
      commit('addCases', cases)
    }
  }
}
