export const state = () => ({
    account: null
});

export const mutations = { // edit variables
    updateAccount(state, account) {
        state.account = account
    }
};

export const actions = { // call Vue : this.$store.dispatch('setAccount', xxx)
    setAccount({ commit }, acc) {
        commit('updateAccount', acc)
        return acc
    }, 
};

export const getters = { // call Vue : this.$store.getters['account']
    account: (state) => {
        return state.account ? state.account : null
    },
};