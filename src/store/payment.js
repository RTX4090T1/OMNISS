import FDBOperation from './helpers/DBoperations';
const collectionDB = new FDBOperation('userProperty');

export default {
  namespaced: true,
  state: {
    itemList: [],
    loading: false,
    error: null,
  },
  getters: {
    getProductList: (state) => {
      return state.itemList;
    },
    getLoading: (state) => {
      return state.loading;
    },
    getError: (state) => {
      return state.error;
    },
  },
  mutations: {
    setItem(state, objectLIST) {
      state.itemList = objectLIST;
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
    }
  }
}