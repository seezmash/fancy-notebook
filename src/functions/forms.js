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

const deleteSelectedFolder = (e) => {

}


const submitAddFolderForm = (e) => {
        if (e) {
          e.preventDefault()
        }
  const db = getFirestore()
  const foldersColRef = collection(db, 'folders')
  const addFolderForm = document.getElementById('add_folder_form')
  addFolderToFirestore(foldersColRef, addFolderForm)
}

const submitAddNoteForm = (e, currentFolder) => {
      if (e) {
        e.preventDefault()
      }
  const db = getFirestore()
  // const addNoteForm = document.querySelector('.add_note')
  const addNoteForm = document.getElementById('add_note_form')
  // console.log('note form items', addNoteForm, addNoteForm2)
  if (currentFolder) {
    const currentNotesColRef = collection(
      db,
      'folders',
      currentFolder.id,
      'notes'
    )
    addNoteToFirestore(currentNotesColRef, addNoteForm)
  } else {
    console.log('there is no current folder')
  }
}


// Firestore

const addFolderToFirestore = (foldersColRef, foldersForm) => {
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

const addNoteToFirestore = (notesColRef, notesForm) => {
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

export {
  submitAddFolderForm,
  submitAddNoteForm,
  addFolderToFirestore,
  addNoteToFirestore
}
