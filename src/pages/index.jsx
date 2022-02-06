import NextHead from '../components/next/NextHead'
import { useEffect, useState } from 'react'
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

// Layout
import Nav from '../components/Nav'
import FolderMenu from '../components/FolderMenu'
import NoteMenu from '../components/NoteMenu'
import NoteEditor from '../components/NoteEditor'

// Functions
import { folderFormSubmit, noteFormSubmit } from '../functions/forms'
import { getDocsFromSnapshot } from '../functions/misc'

// = = = = = = = = = = COMPONENT = = = = = = = = = =

const HomePage = () => {
  const [folders, setFolders] = useState([])
  const [notes, setNotes] = useState([])
  const [notesColRef, setNotesColRef] = useState({})
  const [subcollectionRef, setSubcollectionRef] = useState(null)

  const [currentFolder, setCurrentFolder] = useState(null)
  const [currentNote, setCurrentNote] = useState(null)
  const [currentFolderIndex, setCurrentFolderIndex] = useState(0)
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0)
  const [currentNotesColRef, setCurrentNotesColRef] = useState(null)

  const logCurrentState = () => {
    console.log(
      'notebook state ',
      `index ${currentFolderIndex}`,
      currentFolder,
      '\nnote state ',
      `index ${selectedNoteIndex}`,
      currentNote,
      folders
    )
  }

  const handleFolderClick = (index = -1) => {
    const db = getFirestore()

    setCurrentFolderIndex(index)
    setCurrentFolder(folders[index])
    // updateNotesColRef()
    const currentFolderNotesColRef = collection(
      db,
      'folders',
      folders[index].id,
      'notes'
    )
    console.log(currentFolderNotesColRef)
    setSubcollectionRef(currentFolderNotesColRef)
  }

  const handleNoteClick = (index = -1) => {
    console.log(`note ${index} was clicked`)
    setSelectedNoteIndex(index)
  }

  // = = = = = = = = = = USE EFFECT = = = = = = = = = =

  useEffect(() => {
    const auth = getAuth()
    const db = getFirestore()

    const subToFolder = (db, folderRef) => {
      const unsubFolder = onSnapshot(folderRef, (doc) => {
        console.log(doc.data(), doc.id)
      })
      return unsubFolder
    }

    const foldersColRef = collection(db, 'folders')
    const filteredFoldersColQuery = query(foldersColRef, orderBy('createdAt'))

    const unsubFoldersCol = onSnapshot(filteredFoldersColQuery, (snapshot) => {
      let folderIndex = currentFolderIndex ? currentFolderIndex : 0
      let newFolders = getDocsFromSnapshot(snapshot)
      setFolders(newFolders)
      setCurrentFolder(newFolders[folderIndex])
      const currentFolderNotesColRef = collection(
        db,
        'folders',
        newFolders[folderIndex].id,
        'notes'
      )
      console.log('notes col ref', currentFolderNotesColRef)
      console.log(newFolders[folderIndex].id)
      setNotesColRef(currentFolderNotesColRef)
    })

    const addFolderForm = document.querySelector('.add_folder')
    addFolderForm.addEventListener('submit', (e) => {
      folderFormSubmit(e, foldersColRef, addFolderForm)
    })

    const addNoteForm = document.querySelector('.add_note')
    addNoteForm.addEventListener('submit', (e) => {
      console.log('add note click', subcollectionRef)
      noteFormSubmit(e, subcollectionRef, addNoteForm)
    })
  }, [])

  return (
    <>
      <NextHead title="Notebook bear" />
      <Nav selectedPageIndex={0} />

      <main className="main_content_wrapper page_width_wide bg-blue-200F flex">
        <FolderMenu
          folders={folders}
          currentFolder={currentFolder}
          handleFolderClick={handleFolderClick}
        />
        <NoteMenu
          notes={notes}
          currentNote={currentNote}
          handleNoteClick={handleNoteClick}
        />
        <NoteEditor />
        <div
          className="mt-60 ml-4 h-min cursor-pointer rounded bg-slate-500 px-2 py-2 text-center text-sm font-semibold text-white"
          onClick={logCurrentState}
        >
          log current state
        </div>
      </main>
    </>
  )
}

export default HomePage
