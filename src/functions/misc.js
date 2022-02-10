// Firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
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

const getDocsFromSnapshot = (snapshot) => {
  let newDocs = []
  snapshot.docs.forEach((doc) => {
    newDocs.push({ ...doc.data(), id: doc.id })
  })
  return newDocs
}

const handleFolderClick = (
  passedFolders,
  clickedFolderId,
  currentFolderId,
  index = -1,
  state_currentNote,
  setState_notes,
  setState_currentNote,
  setState_currentFolder
) => {
  if (clickedFolderId !== currentFolderId) {
    const db = getFirestore()
    setState_currentFolder(passedFolders[index])
    const newNotesColRef = collection(db, 'folders', clickedFolderId, 'notes')
    const filteredNotesColQuery = query(newNotesColRef, orderBy('createdAt'))

    const unsubNotesCol = onSnapshot(filteredNotesColQuery, (snapshot) => {
      let newNotes = getDocsFromSnapshot(snapshot)
      setState_notes(newNotes)
      if (!state_currentNote) {
        console.log('there were no notes, new note is ', newNotes[0])
        setState_currentNote(newNotes[0])
      }
    })
    return unsubNotesCol
  } else {
    return null
  }
}

const deleteSelectedNote = (e, currentFolderId, currentNoteId) => {
  if (e) {
    e.preventDefault()
  }
  if (currentFolderId && currentNoteId) {
    const db = getFirestore()
    const docRef = doc(db, 'folders', currentFolderId, 'notes', currentNoteId)
    deleteDoc(docRef)
  }
}

const deleteSelectedFolder = (e, currentFolderId) => {
  if (e) {
    e.preventDefault()
  }
  const db = getFirestore()
  const docRef = doc(db, 'folders', currentFolderId)
  deleteDoc(docRef)
}

export {
  getDocsFromSnapshot,
  handleFolderClick,
  deleteSelectedFolder,
  deleteSelectedNote
}
