import { db } from '@/firebase-config.js';
import { doc, collection, getDocs, getDoc, deleteDoc, updateDoc, query, where, arrayUnion } from 'firebase/firestore/lite';

class FDBOperation {
  constructor(coll) {
    this.dbCollection = collection(db, coll);
  }

  snapShotToList(snapShot) {
    const snapList = [];
    snapShot.docs.forEach(doc => {
      const data = doc.data();
      console.log('Document Data:', data); // Check the structure of each document
      if (Array.isArray(data.allAds)) {
        snapList.push(...data.allAds.map(item => ({ id: doc.id, ...item })));
      } else {
        snapList.push({ id: doc.id, ...data });
      }
    });
    return snapList;
  }

  async dbSnapshot() {
    try {
      const dataSnapshot = await getDocs(this.dbCollection);
      const list = this.snapShotToList(dataSnapshot);
      console.log('Fetched List:', list);
      return list;
    } catch (error) {
      throw new Error("Error fetching data: " + error.message);
    }
  }

  async dbAddItem(item) {
    try {
      const docRef = doc(this.dbCollection, 'AHZWnRmOg9CQtYZmf2bA'); 
      await updateDoc(docRef, {
        allAds: arrayUnion(item) 
      });
      return docRef.id; 
    } catch (error) {
      throw new Error("Error adding item: " + error.message);
    }
  }

  dbDeleteItem(id) {
    return new Promise((resolve, reject) => {
      deleteDoc(doc(this.dbCollection, id))
        .then(() => { resolve(true); })
        .catch((error) => { reject(error); });
    });
  }
  async dbUpdateItemInArray(docId, itemId, updatedData) {
    try {
      const docRef = doc(this.dbCollection, docId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        const updatedArray = docData.allAds.map(item => 
          item.id === itemId ? { ...item, ...updatedData } : item
        );
        await updateDoc(docRef, { allAds: updatedArray });
      } else {
        throw new Error("Document does not exist");
      }
    } catch (error) {
      throw new Error("Error updating item in array: " + error.message);
    }
  }

  dbUpdate(itemId, data) {
    const oldItem = doc(this.dbCollection, itemId);
    return new Promise((resolve, reject) => {
      updateDoc(oldItem, data)
        .then(() => { resolve(true); })
        .catch((error) => { reject(error); });
    });
  }

  dbLoadFromRequest(fieldTitle, compareOperator, request) {
    const compared = query(this.dbCollection, where(fieldTitle, compareOperator, request));
    return new Promise((resolve, reject) => {
      getDocs(compared)
        .then((dataSnapshot) => { resolve(this.snapShotToList(dataSnapshot)); })
        .catch((error) => { reject(error); });
    });
  }
}

export default FDBOperation;