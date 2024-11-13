import FDBOperation from './helpers/DBoperations';
const collectionDB = new FDBOperation('userProperty');

export default {
  namespaced: true,
  state: {
    liked:[],
    userAdds:[],
    sold:[],
    bought:[],
    loading: false,
    error: null,
  },
  getters: {
    getLiked: (state) => {
      return state.liked;
    },
    getSold: (state) => {
        return state.sold;
    },
    getBought: (state) => {
        return state.bought;
    },
    getUserAdds: (state) => {
        return state.userAdds;
    },
    getLoading: (state) => {
      return state.loading;
    },
    getError: (state) => {
      return state.error;
    },
  },
  mutations: {
    setLiked(state, objectLIST) {
      state.liked = objectLIST;
    },
    setBought(state, objectLIST) {
        state.bought = objectLIST;
      },
    setSold(state, objectLIST) {
        state.sold = objectLIST;
    },
    setUserAdds(state, objectLIST) {
        state.userAdds = objectLIST;
    },
    setError(state, error) {
      state.error = error;
    },
    setLoading(state, load) {
      state.loading = load;
    },

  },
  actions: {
    async loadList({ commit }) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        const list = await collectionDB.dbSnapshot();
        console.log(list);
        commit('setItem', list);
      } catch (error) {
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async addItem({ commit, dispatch }, item) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        await collectionDB.dbAddItem(item);
        dispatch('loadList');
      } catch (error) {
        console.log(error);
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async deleteItem({ commit, dispatch }, itemId) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        await collectionDB.dbDeleteItem(itemId);
        dispatch('loadList');
      } catch (error) {
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async updateItem({ commit, dispatch }, { itemId, data }) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        await collectionDB.dbUpdate(itemId, data);
        dispatch('loadList');
      } catch (error) {
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async dbLoadFromRequest({ commit }, { fieldTitle, compareOperator, valueToCompare }) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        const list = await collectionDB.dbLoadFromRequest(fieldTitle, compareOperator, valueToCompare);
        commit('setItem', list);
      } catch (error) {
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
  },
};
