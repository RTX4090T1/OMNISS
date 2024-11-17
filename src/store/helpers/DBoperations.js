import { db } from '@/firebase-config.js';
import { doc, collection, getDoc, updateDoc, arrayUnion, deleteField } from 'firebase/firestore/lite';

class FDBOperations {
    constructor(collectionName) {
        this.dbCollection = collection(db, collectionName);
    }

    async getItemFromFDB(elementName, document) {
        try {
            const docRef = doc(this.dbCollection, document);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const arrayData = docSnap.data()[elementName] || [];
                console.log(arrayData);
                return arrayData;
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    async getDocumentFromFDB(document) {
        try {
            const docRef = doc(this.dbCollection, document);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const docData = docSnap.data() || {};
                console.log(docData);
                
                return docData;
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    async updateItemInFDB(oldElement, document, newElement) {
        try {
            const docRef = doc(this.dbCollection, document);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                await updateDoc(docRef, {
                    [oldElement]: arrayUnion(newElement),
                });
            } else {
                throw new Error('Document does not exist');
            }
        } catch (error) {
            throw new Error('Error updating item in array: ' + error.message);
        }
    }

    async updateDocumentInFDB(document, arrayFieldName, data) {
        try {
            const docRef = doc(this.dbCollection, document);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                await updateDoc(docRef, {
                    [arrayFieldName]: data,
                });
                console.log('Array successfully added or updated in the document!');
            } else {
                throw new Error('Document does not exist');
            }
        } catch (error) {
            throw new Error('Error updating document: ' + error.message);
        }
    }

    async deleteItemFromFDB(document, itemName) {
        const docRef = doc(this.dbCollection, document);
        try {
            await updateDoc(docRef, {
                [itemName]: deleteField(),
            });
            console.log('Field successfully deleted!');
        } catch (error) {
            console.error('Error deleting field: ', error);
        }
    }
}

export default FDBOperations;