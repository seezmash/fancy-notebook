import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc
} from 'firebase/firestore'

const folderFormSubmit = (e, foldersColRef, folderForm) => {
  e.preventDefault()
  addDoc(foldersColRef, {
    title: folderForm.title.value,
    createdAt: serverTimestamp()
  }).then(() => {
    folderForm.reset()
  })
}

const noteFormSubmit = (e, notesColRef, noteForm) => {
  e.preventDefault()
  console.log('note submit - notesColRef', notesColRef)
  // addDoc(notesColRef, {
  //   title: noteForm.title.value,
  //   createdAt: serverTimestamp()
  // }).then(() => {
  //   noteForm.reset()
  // })
}

export { folderFormSubmit, noteFormSubmit }
