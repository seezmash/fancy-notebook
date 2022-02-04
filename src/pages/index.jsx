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
import NotebookMenu from '../components/NotebookMenu'
import NoteMenu from '../components/NoteMenu'
import NoteEditor from '../components/NoteEditor'

// Functions
import { initializeDatabase } from '../functions/firebase/firestore'
import { initializeAuthentication } from '../functions/firebase/auth'

const startNotesSnapshot = (
  db,
  currentNotebookArray,
  currentNotebookIndex,
  setNotes,
  setCurrentNotesColRef
) => {
  // console.log('title 0', currentNotebookArray[0].title)
  // console.log('current notebook index', currentNotebookIndex)
  const notesColRef = collection(
    db,
    'notebooks',
    currentNotebookArray[currentNotebookIndex].title,
    'notes'
  )
  onSnapshot(notesColRef, (snapshot) => {
    let newNotes = []
    snapshot.docs.forEach((doc) => {
      newNotes.push({ ...doc.data(), id: doc.id })
    })
    setCurrentNotesColRef(
      notesColRef,
      console.log('current notes were updated')
    )
    setNotes(newNotes)
  })
}

const handleNotebookClick = (index = -1) => {
  console.log(`notebook ${index} was clicked`)
}

const handleNoteClick = (index = -1) => {
  console.log(`note ${index} was clicked`)
}

const HomePage = () => {
  const [notebooks, setNotebooks] = useState([])
  const [notes, setNotes] = useState([])
  const [currentNotebook, setCurrentNotebook] = useState([])

  const [selectedNotebookIndex, setSelectedNotebookIndex] = useState(0)
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0)
  const [currentNotesColRef, setCurrentNotesColRef] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    const db = getFirestore()
    const notebooksColRef = collection(db, 'notebooks')
    const filteredNotebooksColQuery = query(
      notebooksColRef,
      orderBy('createdAt')
    )

    // const currentNotesColRef = collection(
    //   db,
    //   'notebooks',
    //   currentNotebookId,
    //   'notes'
    // )

    // const userSubscriptions = `collection(db, "customers", currentUser.uid, "subscriptions")`

    const unsubNotebooksCol = onSnapshot(
      filteredNotebooksColQuery,
      (snapshot) => {
        let newBooks = []
        snapshot.docs.forEach((doc) => {
          newBooks.push({ ...doc.data(), id: doc.id })
        })
        setNotebooks(
          newBooks,
          startNotesSnapshot(
            db,
            newBooks,
            selectedNotebookIndex,
            setNotes,
            setCurrentNotesColRef
          )
        )
      }
    )

    const addNotebookForm = document.querySelector('.add_notebook')
    addNotebookForm.addEventListener('submit', (e) => {
      e.preventDefault()

      addDoc(notebooksColRef, {
        title: addNotebookForm.title.value,
        createdAt: serverTimestamp()
      }).then(() => {
        addNotebookForm.reset()
      })
    })

    const addNoteForm = document.querySelector('.add_note')
    addNoteForm.addEventListener('submit', (e) => {
      e.preventDefault()
      console.log('notes ref from form', currentNotesColRef)
      if (currentNotesColRef) {
        addDoc(currentNotesColRef, {
          title: addNoteForm.title.value,
          createdAt: serverTimestamp()
        }).then(() => {
          addNoteForm.reset()
        })
      } else {
        console.log(
          'somethings wrong with the current notes list',
          currentNotesColRef
        )
      }
    })
  }, [])

  return (
    <>
      <NextHead title="Notebook bear" />
      <Nav selectedPageIndex={0} />

      <main className="main_content_wrapper page_width_wide bg-blue-200F flex">
        <NotebookMenu
          notebooks={notebooks}
          selectedIndex={0}
          handleNotebookClick={handleNotebookClick}
        />
        <NoteMenu
          notes={notes}
          selectedIndex={0}
          handleNoteClick={handleNoteClick}
        />
        <NoteEditor />
      </main>
    </>
  )
}

export default HomePage
