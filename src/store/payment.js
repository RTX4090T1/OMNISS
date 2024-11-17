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
      console.log("setItem mutation called with:", objectLIST);
      state.itemList = objectLIST;
    },
    setError(state, error) {
      console.log("setError mutation called with:", error);
      state.error = error;
    },
    setLoading(state, load) {
      console.log("setLoading mutation called with:", load);
      state.loading = load;
    },
  },
  actions: {
    async loadList({ commit }) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        const list = await collectionDB.dbSnapshot();
        console.log("loadList action - list retrieved:", list);
        commit('setItem', list);
      } catch (error) {
        console.error("loadList action - error:", error);
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async addItem({ commit, dispatch }, item) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        console.log("addItem action - item to add:", item);
        await collectionDB.dbAddItem(item);
        dispatch('loadList');
      } catch (error) {
        console.error("addItem action - error:", error);
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async updateItem({ commit, dispatch }, { itemId, data }) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        console.log("updateItem action - itemId:", itemId, "data:", data);
        await collectionDB.dbUpdate(itemId, data);
        dispatch('loadList');
      } catch (error) {
        console.error("updateItem action - error:", error);
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    }
  }
}