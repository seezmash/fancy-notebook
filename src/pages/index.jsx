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

const HomePage = () => {
  const [state_folders, setState_folders] = useState([])
  const [state_notes, setState_notes] = useState([])
  const [state_currentFolder, setState_currentFolder] = useState(null)
  const [state_currentFolderRef, setState_currentFolderRef] = useState(null)
  const [state_currentNote, setState_currentNote] = useState(null)
  const [state_mostRecentNotePerFolder, setState_mostRecentNotePerFolder] =
    useState([])

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
        let mostRecentNotesArray = Array.from(state_mostRecentNotePerFolder)
        let matchingFolderIndex = mostRecentNotesArray.findIndex(
          (item) => item.folderId === clickedFolderId
        )
        if (matchingFolderIndex === -1) {
          if (newNotes[0]) {
            handleNoteClick(newNotes, clickedFolderId, newNotes[0].id, 0)
          }
        } else {
          if (mostRecentNotesArray[matchingFolderIndex] && newNotes[0]) {
            let mostRecentNoteId =
              mostRecentNotesArray[matchingFolderIndex].noteId
            let matchingNoteIndex = newNotes.findIndex(
              (item) => item.id === mostRecentNoteId
            )
            if (matchingNoteIndex === -1) {
              handleNoteClick(newNotes, clickedFolderId, newNotes[0].id, 0)
            } else {
              handleNoteClick(
                newNotes,
                clickedFolderId,
                mostRecentNotesArray[matchingFolderIndex].noteId,
                matchingNoteIndex
              )
            }
          }
        }
      })
      return unsubNotesCol
    } else {
      return null
    }
  }

  const handleNoteClick = (
    passedNotes,
    currentFolderId,
    clickedNoteId,
    index = -1
  ) => {
    setState_currentNote(passedNotes[index])
    let mostRecentNotesArray = Array.from(state_mostRecentNotePerFolder)
    // console.log('starting recent array', mostRecentNotesArray)
    let matchingIndex = mostRecentNotesArray.findIndex(
      (item) => item.folderId === currentFolderId
    )
    // console.log('matching index is', matchingIndex)
    if (matchingIndex === -1) {
      mostRecentNotesArray.push({
        folderId: currentFolderId,
        noteId: clickedNoteId
      })
    } else {
      mostRecentNotesArray[matchingIndex].noteId = clickedNoteId
    }
    // console.log('new recent array', mostRecentNotesArray)
    setState_mostRecentNotePerFolder(mostRecentNotesArray)
  }

  const renameSelectedNote = (e, currentFolderId, currentNoteId) => {
    if (e) {
      e.preventDefault()
    }
    const db = getFirestore()
    const docRef = doc(db, 'folders', currentFolderId, 'notes', currentNoteId)
    const renameNoteForm = document.getElementById('rename_note_form')
    updateDoc(docRef, { title: renameNoteForm.title.value }).then(() => {
      renameNoteForm.reset()
    })
  }

  // = = = = = = = = = = USE EFFECT = = = = = = = = = =

  useEffect(() => {
    const db = getFirestore()
    const foldersColRef = collection(db, 'folders')
    const filteredFoldersColQuery = query(foldersColRef, orderBy('createdAt'))

    const unsubFoldersCol = onSnapshot(filteredFoldersColQuery, (snapshot) => {
      let newFolders = getDocsFromSnapshot(snapshot)
      setState_folders(newFolders)
      if (state_currentFolder === null) {
        if (newFolders.length > 0) {
          handleFolderClick(newFolders, newFolders[0].id, null, 0)
        }
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
