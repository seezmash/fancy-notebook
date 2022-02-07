import NextHead from '../components/next/NextHead'
import React, { useEffect, useState } from 'react'

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
import FoldersMenu from '../components/FoldersMenu'
import NotesMenu from '../components/NotesMenu'
import NoteEditor from '../components/NoteEditor'
import AboutSidePanel from '../components/AboutSidePanel'

// Functions
import { submitAddFolderForm, submitAddNoteForm } from '../functions/forms'
import { getDocsFromSnapshot } from '../functions/misc'

// = = = = = = = = = = COMPONENT = = = = = = = = = =

const HomePage = () => {
  const [state_folders, setState_folders] = useState([])
  const [state_notes, setState_notes] = useState([])
  const [state_currentFolder, setState_currentFolder] = useState(null)
  const [state_currentFolderRef, setState_currentFolderRef] = useState(null)
  const [state_currentNote, setState_currentNote] = useState(null)

  const logCurrentState = () => {
    console.log(
      'current folder',
      state_currentFolder,
      '\ncurrent note',
      state_currentNote,
      state_folders
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

  const handleNoteClick = (passedNotes, clickedNoteId, index = -1) => {
    setState_currentNote(passedNotes[index])
  }

    const deleteSelectedFolder = (e, currentFolderId) => {
      if(e) { e.preventDefault() }
      console.log(`delete folder ${currentFolderId} was clicked`)
        const db = getFirestore()
        const docRef = doc(db, 'folders', currentFolderId)

        deleteDoc(docRef).then(() => {
          console.log(`${currentFolderId} was deleted`)
        })
        // set new current folder
    }

        const deleteSelectedNote = (e, currentFolderId, currentNoteId, noteName) => {
          if (e) {
            e.preventDefault()
          }
          if(currentNoteId) {
            console.log(`delete note ${currentNoteId}`)  
            const db = getFirestore()
            const docRef = doc(db, 'folders', currentFolderId, 'notes', currentNoteId)

            deleteDoc(docRef).then(() => {
              console.log(`${currentFolderId} was deleted`)
            })
            // set new current note

          }
        }
  // = = = = = = = = = = USE EFFECT = = = = = = = = = =

  useEffect(() => {
    const auth = getAuth()
    const db = getFirestore()

    const foldersColRef = collection(db, 'folders')
    const filteredFoldersColQuery = query(foldersColRef, orderBy('createdAt'))

    const unsubFoldersCol = onSnapshot(filteredFoldersColQuery, (snapshot) => {
      let newFolders = getDocsFromSnapshot(snapshot)
      setState_folders(newFolders)
      if (!state_currentFolder) {
        setState_currentFolder(newFolders[0])
      }
    })

  }, [])

  return (
    <>
      <NextHead title="Notebook bear" />
      <Nav selectedPageIndex={0} />

      <main className="main_content_wrapper page_width_wide bg-blue-200F flex">
        <FoldersMenu
          state_folders={state_folders}
          state_currentFolder={state_currentFolder}
          handleFolderClick={handleFolderClick}
          submitAddFolderForm={submitAddFolderForm}
          deleteSelectedFolder={deleteSelectedFolder}
        />
        <NotesMenu
          state_notes={state_notes}
          state_currentNote={state_currentNote}
          state_currentFolder={state_currentFolder}
          handleNoteClick={handleNoteClick}
          submitAddNoteForm={submitAddNoteForm}
          deleteSelectedNote={deleteSelectedNote}
        />
        <NoteEditor state_currentNote={state_currentNote} />
      </main>

        {/* <div
          className="fixed bottom-8 right-8 mt-60 ml-4 h-min cursor-pointer rounded bg-slate-200 text-slate-600 px-2 py-2 text-center text-sm font-semibold"
          onClick={logCurrentState}
          >
          log current state
        </div> */}
    </>
  )
}

export default HomePage
