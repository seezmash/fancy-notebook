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
  if (addFolderForm.title) {
    addDoc(foldersColRef, {
      title: addFolderForm.title.value,
      createdAt: serverTimestamp()
    }).then(() => {
      addFolderForm.reset()
    })
  }
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
    if (addNoteForm.title) {
      addDoc(currentNotesColRef, {
        title: addNoteForm.title.value,
        createdAt: serverTimestamp()
      }).then(() => {
        addNoteForm.reset()
      })
    }
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

export { submitAddFolderForm, submitAddNoteForm, renameSelectedFolder }
