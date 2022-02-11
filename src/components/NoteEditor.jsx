import Link from 'next/link'
// import Tiptap from './Tiptap'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
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

const NoteEditor = ({
  state_currentFolder,
  state_currentNote,
  setNoteData,
  mainEditor
}) => {
  let currentNoteName = state_currentNote ? state_currentNote.title : null
  let currentNoteId = state_currentNote ? state_currentNote.id : null
  let currentFolderId = state_currentFolder ? state_currentFolder.id : null
  let noteContent = state_currentNote ? state_currentNote.content : null

  // const setNoteData = (currentFolderId, currentNoteId, textEditor) => {
  //   console.log('set note data')
  //   if (currentFolderId && currentNoteId) {
  //     const db = getFirestore()

  //     const noteRef = doc(
  //       db,
  //       'folders',
  //       currentFolderId,
  //       'notes',
  //       currentNoteId
  //     )

  //     getDoc(noteRef).then((doc) => {
  //       let docData = doc.data()
  //       if (docData) {
  //         console.log(docData.content)
  //         console.log(textEditor.commands)
  //         textEditor.commands.setContent(docData.content)
  //       }
  //     })
  //   }
  // }

  const uploadJson = (folderId, noteId) => {
    if (folderId && noteId) {
      const db = getFirestore()
      const noteRef = doc(db, 'folders', folderId, 'notes', noteId)
      let contentJSON = mainEditor.getJSON()

      if (contentJSON) {
        updateDoc(noteRef, { content: contentJSON }).then(() => {
          console.log('content uploaded')
        })
      } else {
        console.log('there was an error getting editor json')
      }
    }
  }

  return (
    <div className="border-rF relative ml-4 h-full w-56 flex-grow">
      <div className="border-bF mb-6 w-full px-3 text-sm font-semibold text-gray-600">
        {/* <div className="mr-3 inline-block h-5 w-5 align-middle">
          <img
            src="./icons/edit_note_black_24dp.svg"
            className="h-full w-full"
          />
        </div> */}
        <div className="relative inline-block align-middle">
          <span className="select-none"> Editor: </span>
          <span className="ml-1">{currentNoteName}</span>
        </div>
      </div>
      <div className="borderF relative h-full w-full overflow-hidden rounded-md bg-white py-3 shadow">
        <div className="tiptap_menu bg-gray-200F center justify-right h-10F mb-6 flex w-full flex-wrap border-b border-gray-100 px-4 pb-3">
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/bold.svg"
            />
          </button>
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/italic.svg"
            />
          </button>
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/underline.svg"
            />
          </button>
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/h-1.svg"
            />
          </button>
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/h-2.svg"
            />
          </button>
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/h-3.svg"
            />
          </button>
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/h-4.svg"
            />
          </button>
          <button className="bg-gray-50F mr-1 mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/double-quotes-l.svg"
            />
          </button>
          <button className="bg-gray-50F mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/list-unordered.svg"
            />
          </button>
          <button className="bg-gray-50F mb-1.5 mt-1 h-full w-9 rounded">
            <img
              className="ml-2.5 mt-0.5 h-4 w-4 content-center"
              src="./icons/remix/list-ordered.svg"
            />
          </button>
        </div>
        <div className="borderF mx-5 mb-4 mt-2 rounded-md border-gray-100 p-1">
          <EditorContent editor={mainEditor} />
        </div>
      </div>
      <button
        onClick={() => {
          uploadJson(currentFolderId, currentNoteId)
        }}
        className="float-right mx-auto mt-10 mr-2 rounded bg-gray-200 p-2 text-sm font-semibold text-gray-500 hover:bg-gray-300"
      >
        Save changes
      </button>
    </div>
  )
}

export default NoteEditor
