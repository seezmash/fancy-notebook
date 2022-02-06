import NextHead from '../components/next/NextHead'
import React, { useEffect, useState, useRef } from 'react'
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
import { foldersFormSubmit, notesFormSubmit } from '../functions/forms'
import { getDocsFromSnapshot } from '../functions/misc'

// = = = = = = = = = = COMPONENT = = = = = = = = = =

const HomePage = () => {
  const [folders, setFolders] = useState([])
  const [notes, setNotes] = useState([])
  const [currentFolder, setCurrentFolder] = useState(null)
  const [currentNote, setCurrentNote] = useState(null)
  const currentFolderStateRef = React.useRef(currentFolder)

  const logCurrentState = () => {
    console.log(
      'current folder',
      currentFolder,
      '\ncurrent note',
      currentNote,
      folders
    )
  }

  const handleFolderClick = (
    passedFolders,
    clickedFolderId,
    currentFolderId,
    index = -1
  ) => {
    if (clickedFolderId !== currentFolderId) {
      const db = getFirestore()
      setCurrentFolder(passedFolders[index])
      const newNotesColRef = collection(db, 'folders', clickedFolderId, 'notes')
      const filteredNotesColQuery = query(newNotesColRef, orderBy('createdAt'))

      const unsubNotesCol = onSnapshot(filteredNotesColQuery, (snapshot) => {
        let newNotes = getDocsFromSnapshot(snapshot)
        setNotes(newNotes)
        console.log('new notes', newNotes)
        if (!currentNote) {
          console.log('there were no notes, new note is ', newNotes[0])
          setCurrentNote(newNotes[0])
        }
      })
      return unsubNotesCol
    } else {
      return null
    }
  }

  const handleNoteClick = (index = -1) => {
    console.log(`note ${index} was clicked`)
  }

  const foldersFormOnSubmit = (e) => {
    e.preventDefault()
    const db = getFirestore()
    const foldersColRef = collection(db, 'folders')
    const addFolderForm = document.querySelector('.add_folder')
    foldersFormSubmit(foldersColRef, addFolderForm)
  }

  const notesFormOnSubmit = (e) => {
    e.preventDefault()
    const db = getFirestore()
    const addNoteForm = document.querySelector('.add_note')
    if (currentFolder) {
      const currentNotesColRef = collection(
        db,
        'folders',
        currentFolder.id,
        'notes'
      )
      console.log('new col ref is', currentNotesColRef)

      notesFormSubmit(currentNotesColRef, addNoteForm)
    } else {
      console.log('there is no current folder')
    }
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
      let newFolders = getDocsFromSnapshot(snapshot)
      setFolders(newFolders)
      if (!currentFolder) setCurrentFolder(newFolders[0])
    })

    // const addFolderForm = document.querySelector('.add_folder')
    // addFolderForm.addEventListener('submit', (e) => {
    //   e.preventDefault()
    //   foldersFormSubmit(foldersColRef, addFolderForm)
    // })

    // const addNoteForm = document.querySelector('.add_note')
    // addNoteForm.addEventListener('submit', (e) => {
    //   e.preventDefault()
    //   let currentFolderState = currentFolderStateRef.current

    //   console.log('folder state ref', currentFolderStateRef.current)

    //   console.log('current folder on submit', currentFolderState)
    //   if (currentFolderState) {
    //     const currentNotesColRef = collection(
    //       db,
    //       'folders',
    //       currentFolderState.id,
    //       'notes'
    //     )
    //     console.log('new col ref is', currentNotesColRef)

    //     notesFormSubmit(currentNotesColRef, addNoteForm)
    //   } else {
    //     console.log('there is no current folder')
    //   }
    // })
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
          foldersFormOnSubmit={foldersFormOnSubmit}
        />
        <NoteMenu
          notes={notes}
          currentNote={currentNote}
          handleNoteClick={handleNoteClick}
          notesFormOnSubmit={notesFormOnSubmit}
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
