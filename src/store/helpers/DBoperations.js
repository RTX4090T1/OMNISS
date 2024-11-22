import { db } from '@/firebase-config.js'
import { doc, collection, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore/lite'

class FDBOperations {
    constructor(collectionName) {
        this.dbCollection = collection(db, collectionName)
    }

    async getItemFromFDB(elementName, document) {
        try {
            const docRef = doc(this.dbCollection, document)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const arrayData = docSnap.data()[elementName] || []
                console.log(arrayData)
                return arrayData
            } else {
                console.error('No such document!')
            }
        } catch (error) {
            console.error('Error fetching document:', error)
        }
    }

    async getDocumentFromFDB(document) {
        try {
            console.log('Fetching document from Firestore:', document);
            const docRef = doc(this.dbCollection, document);
            console.log('Document reference created:', docRef);
            const docSnap = await getDoc(docRef);
            console.log('Document snapshot received:', docSnap);
    
            if (docSnap.exists()) {
                const docData = docSnap.data() || {};
                console.log('Document data:', docData);
    
                return docData;
            } else {
                console.error('No such document!');
                return {};
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            return {};
        }
    }

    async updateItemInFDB(arrayName, document, newElement) {
        try {
            const docRef = doc(this.dbCollection, document)
            const docSnapshot = await getDoc(docRef)
            if (docSnapshot.exists()) {
                await updateDoc(docRef, {
                    [arrayName]: arrayUnion(newElement),
                })
            } else {
                throw new Error('Document does not exist')
            }
        } catch (error) {
            throw new Error('Error updating item in array: ' + error.message)
        }
    }

    async updateDocumentInFDB(document, arrayFieldName, data) {
        try {
            const docRef = doc(this.dbCollection, document)
            const docSnapshot = await getDoc(docRef)
            if (docSnapshot.exists()) {
                await updateDoc(docRef, {
                    [arrayFieldName]: data,
                })
                console.log('Array successfully added or updated in the document!')
            } else {
                throw new Error('Document does not exist')
            }
        } catch (error) {
            throw new Error('Error updating document: ' + error.message)
        }
    }

    async deleteItemFromFDB(document, field, item) {
        const docRef = doc(this.dbCollection, document)
        try {
            await updateDoc(docRef, {
                [field]: arrayRemove(item),
            })
            console.log('Field successfully deleted!')
        } catch (error) {
            console.error('Error deleting field: ', error)
        }
    }

    async updateElementInArray(documentId, field, newElement) {
        try {
            const docRef = doc(this.dbCollection, documentId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                let array = data[field]

                
                const index = array.findIndex((item) => item.id == newElement.id)

                if (index !== -1) {
                    array[index] = newElement

                    await updateDoc(docRef, {
                        [field]: array,
                    })

                    console.log('Element successfully updated!')
                } else {
                    console.error('Element not found in array')
                }
            } else {
                console.error('No such document!')
            }
        } catch (error) {
            console.error('Error updating element in array:', error)
        }
    }
}

export default FDBOperations
