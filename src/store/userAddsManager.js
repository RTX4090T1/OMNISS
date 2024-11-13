import FDBOperation from './helpers/DBoperations';
const collectionDB = new FDBOperation('uFAOS');

export default {
  namespaced: true,
    
  actions: {
    async loadList() {
      try {
        const list = await collectionDB.dbSnapshot();
        return list
      } catch (error){
        console.log("error")
      }

    },
    async addItem({ dispatch }, item) {
      try {
        await collectionDB.dbAddItem(item);
        dispatch('loadList');
      } catch (error) {
        console.log("error")
      } 
    },
    async deleteItem({ dispatch }, itemId) {
      try {
        await collectionDB.dbDeleteItem(itemId);
        dispatch('loadList');
      } catch (error) {
        console.log("error")
      } 
    },
  },
};
