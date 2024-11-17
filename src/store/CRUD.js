import FDBOperations from './helpers/DBoperations'

export default {
    namespaced: true,
    state: {
        loading: false,
        error: null,
    },
    getters: {
        getLoading: (state) => state.loading,
        getError: (state) => state.error,
    },
    mutations: {
        setError(state, error) {
            state.error = error
        },
        setLoading(state, load) {
            state.loading = load
        },
    },
    actions: {
        async updateItemInFDB({ commit }, oldElement, document, newElement, collectionName) {
            commit('setError', null)
            commit('setLoading', true)
            try {
                const action = FDBOperations(collectionName)
                await action.updateItemInFDB(oldElement, document, newElement)
            } catch (error) {
                commit('setError', error)
            } finally {
                commit('setLoading', false)
            }
        },
        async updateDocumentInFDB({ commit }, document, newElement, collectionName, data) {
            commit('setError', null)
            commit('setLoading', true)
            try {
                const action = FDBOperations(collectionName)
                await action.updateDocumentInFDB(document, newElement, data)
            } catch (error) {
                commit('setError', error)
            } finally {
                commit('setLoading', false)
            }
        },
        async getDocumentFromFDB({ commit }, { collectionName, document }) {
            commit('setError', null);
            commit('setLoading', true);
            try {
                const action = new FDBOperations(collectionName);
                const docData = await action.getDocumentFromFDB(document);
                console.log('Fetched document data:', docData);
                return docData;
            } catch (error) {
                commit('setError', error);
            } finally {
                commit('setLoading', false);
            }
        },
        async getItemFromFDB({ commit }, {collectionName, document, elementName}) {
            commit('setError', null)
            commit('setLoading', true)
            try {
                const action = FDBOperations(collectionName)
                const result = await action.getItemFromFDB(elementName, document)
                console.log(result+"kfgklunvfhbmgfhfgvngrhrtvhrthrtg");
                
                return result
            } catch (error) {
                commit('setError', error)
            } finally {
                commit('setLoading', false)
            }
        },
        async deleteItemFromFDB({ commit }, collectionName, document, elementName) {
            commit('setError', null)
            commit('setLoading', true)
            try {
                const action = FDBOperations(collectionName)
                await action.deleteItemFromFDB(document, elementName)
            } catch (error) {
                commit('setError', error)
            } finally {
                commit('setLoading', false)
            }
        },
    },
}
