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

const foldersFormSubmit = (foldersColRef, foldersForm) => {
  if (foldersForm.title) {
    addDoc(foldersColRef, {
      title: foldersForm.title.value,
      createdAt: serverTimestamp()
    }).then(() => {
      foldersForm.reset()
    })
  } else {
    console.log('there is no folder title')
  }
}

const notesFormSubmit = (notesColRef, notesForm) => {
  if (notesForm.title) {
    addDoc(notesColRef, {
      title: notesForm.title.value,
      createdAt: serverTimestamp()
    }).then(() => {
      notesForm.reset()
    })
  } else {
    console.log('this is no note title')
  }
}

export { foldersFormSubmit, notesFormSubmit }
