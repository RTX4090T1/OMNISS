import FDBOperation from './helpers/DBoperations';
const collectionDB = new FDBOperation('todo', 'YOUR_DOCUMENT_ID'); // Specify the document ID

export default {
  namespaced: true,
  state: {
    itemList: [],
    loading: false,
    error: null,
  },
  getters: {
    getProductList: (state) => state.itemList,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
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
        if (Array.isArray(list)) {
          commit('setItem', list);
        } else {
          console.error("Expected an array but got:", list);
        }
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
    async updateItemInArray({ commit, dispatch }, { docId, itemId, data }) {
      commit('setError', null);
      commit('setLoading', true);
      try {
        await collectionDB.dbUpdateItemInArray(docId, itemId, data);
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