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
  const addNoteForm = document.getElementById('add_note_form')
  if (currentFolder) {
    const currentNotesColRef = collection(
      db,
      'folders',
      currentFolder.id,
      'notes'
    )
    addNoteToFirestore(currentNotesColRef, addNoteForm)
  } else {
    console.log('failed to add note, there is no current folder')
  }
}

const renameSelectedFolder = (e, currentFolderId) => {
  if (e) {
    e.preventDefault()
  }
  console.log(`rename folder ${currentFolderId} was clicked`)
  const db = getFirestore()
  const docRef = doc(db, 'folders', currentFolderId)
  const renameFolderForm = document.getElementById('rename_folder_form')

  updateDoc(docRef, { title: renameFolderForm.title.value }).then(() => {
    renameFolderForm.reset()
    console.log(`${currentFolderId} was renamed`)
  })
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
    console.log('failed to create folder, there is no folder title')
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
    console.log('failed to create note, this is no note title')
  }
}

export {
  submitAddFolderForm,
  submitAddNoteForm,
  addFolderToFirestore,
  addNoteToFirestore,
  renameSelectedFolder
}
