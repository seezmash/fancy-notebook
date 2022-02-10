import NextHead from '../components/next/NextHead'
import React, { useEffect, useState } from 'react'

// Firebase
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

// Functions
import {
  submitAddFolderForm,
  submitAddNoteForm,
  renameSelectedFolder
} from '../functions/forms'
import {
  getDocsFromSnapshot,
  deleteSelectedFolder,
  deleteSelectedNote
} from '../functions/misc'

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
      const newNotesColRef = collection(db, 'folders', clickedFolderId, 'notes')
      const filteredNotesColQuery = query(newNotesColRef, orderBy('createdAt'))

      setState_currentFolder(passedFolders[index])

      const unsubNotesCol = onSnapshot(filteredNotesColQuery, (snapshot) => {
        let newNotes = getDocsFromSnapshot(snapshot)
        setState_notes(newNotes)
        console.log('notes snapshot updated')
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

  const getNoteData = async (currentFolderId, currentNoteId) => {
    console.log('getNoteData', currentFolderId, currentNoteId)
    if (currentFolderId && currentNoteId) {
      const db = getFirestore()

      const noteRef = doc(
        db,
        'folders',
        currentFolderId,
        'notes',
        currentNoteId
      )

      getDoc(noteRef).then((doc) => {
        console.log('note data', doc.data(), doc)
        return 'greenest fuzz'
      })
      // return result
    }
  }

  // const deleteSelectedFolder = (e, currentFolderId) => {
  //   if (e) {
  //     e.preventDefault()
  //   }
  //   const db = getFirestore()
  //   const docRef = doc(db, 'folders', currentFolderId)
  //   deleteDoc(docRef)
  // }

  const renameSelectedNote = (e, currentFolderId, currentNoteId) => {
    if (e) {
      e.preventDefault()
    }
    const db = getFirestore()
    const docRef = doc(db, 'folders', currentFolderId, 'notes', currentNoteId)
    const renameNoteForm = document.getElementById('rename_note_form')
    updateDoc(docRef, { title: renameNoteForm.title.value }).then(() => {
      renameNoteForm.reset()
      console.log(`${currentFolderId} was renamed`)
    })
  }

  // const deleteSelectedNote = (e, currentFolderId, currentNoteId) => {
  //   if (e) {
  //     e.preventDefault()
  //   }
  //   if (currentFolderId && currentNoteId) {
  //     const db = getFirestore()
  //     const docRef = doc(db, 'folders', currentFolderId, 'notes', currentNoteId)
  //     deleteDoc(docRef)
  //   }
  // }

  // = = = = = = = = = = USE EFFECT = = = = = = = = = =

  useEffect(() => {
    const db = getFirestore()
    const foldersColRef = collection(db, 'folders')
    const filteredFoldersColQuery = query(foldersColRef, orderBy('createdAt'))

    const unsubFoldersCol = onSnapshot(filteredFoldersColQuery, (snapshot) => {
      let newFolders = getDocsFromSnapshot(snapshot)
      setState_folders(newFolders)
      console.log('snapshot current folder', state_currentFolder)
      if (!state_currentFolder) {
        setState_currentFolder(newFolders[0])
      } else {
        let currentFolderExists = newFolders.find(
          (element) => element.id === state_currentFolder.id
        )
        // if (!currentFolderExists) {
        //   setState_currentFolder(newFolders[0])
        // }
      }
    })
  }, [])

  return (
    <>
      <NextHead title="Fancy notebook" />
      <Nav selectedPageIndex={0} />

      <div className="main_content_wrapper page_width_wide fixed inset-0 mx-auto hidden h-full w-full">
        <div className="bg-slate-200F absolute bottom-20 right-5 h-80 w-80 opacity-5">
          <img
            src="./like_a_sir_min.svg"
            className="h-full w-full object-contain"
            alt="like a sir"
          />
        </div>
      </div>

      <main className="main_content_wrapper page_width_wide bg-blue-200F flex px-4">
        <FoldersMenu
          state_folders={state_folders}
          state_currentFolder={state_currentFolder}
          handleFolderClick={handleFolderClick}
          submitAddFolderForm={submitAddFolderForm}
          deleteSelectedFolder={deleteSelectedFolder}
          renameSelectedFolder={renameSelectedFolder}
        />
        <NotesMenu
          state_notes={state_notes}
          state_currentNote={state_currentNote}
          state_currentFolder={state_currentFolder}
          handleNoteClick={handleNoteClick}
          submitAddNoteForm={submitAddNoteForm}
          deleteSelectedNote={deleteSelectedNote}
          renameSelectedNote={renameSelectedNote}
        />
        <NoteEditor
          state_currentFolder={state_currentFolder}
          state_currentNote={state_currentNote}
          getNoteData={getNoteData}
        />
      </main>

      <div
        className="fixed bottom-8 right-8 mt-60 ml-4 h-min cursor-pointer rounded bg-gray-200 p-2 text-center text-sm font-semibold text-gray-500 hover:bg-gray-300"
        onClick={logCurrentState}
      >
        log state
      </div>
    </>
  )
}

export default HomePage
