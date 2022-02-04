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

const getCurrentNotesCollection = () => {}

const HomePage = () => {
  const [notebooks, setNotebooks] = useState([])
  const [notes, setNotes] = useState([])
  const [currentNotebookId, setCurrentNotebookId] = useState([])
  const [selectedNotebookIndex, setSelectedNotebookIndex] = useState(0)
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0)
  const [selectedNotesColRef, setSelectedNotesColRef] = useState(null)

  useEffect(() => {
    // initializeDatabase()
    // initializeAuthentication()
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
        let fetchedNotebooks = []
        snapshot.docs.forEach((doc) => {
          fetchedNotebooks.push({ ...doc.data(), id: doc.id })
        })
        console.log(fetchedNotebooks)
        setNotebooks(fetchedNotebooks)
        if (fetchedNotebooks[0]) {
          console.log('title 0', fetchedNotebooks[0].title)
          const currentNotesColRef = collection(
            db,
            'notebooks',
            fetchedNotebooks[0].title,
            'notes'
          )
          console.log('NOTES COL REF', currentNotesColRef)
          setSelectedNotesColRef(currentNotesColRef)
          onSnapshot(currentNotesColRef, (snapshot) => {
            let fetchedNotes = []
            snapshot.docs.forEach((doc) => {
              fetchedNotes.push({ ...doc.data(), id: doc.id })
            })
            console.log('fetched notes', fetchedNotes)
            setNotes(fetchedNotes)
          })
        }
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

      if (selectedNotesColRef) {
        addDoc(selectedNotesColRef, {
          title: addNoteForm.title.value,
          createdAt: serverTimestamp()
        }).then(() => {
          addNoteForm.reset()
        })
      } else {
        console.log(
          'somethings wrong with the current notes list',
          selectedNotesColRef
        )
      }
    })
  }, [])

  return (
    <>
      <NextHead title="Notebook bear" />
      <Nav selectedPageIndex={0} />

      <main className="main_content_wrapper page_width_wide bg-blue-200F flex">
        <NotebookMenu notebooks={notebooks} selectedIndex={0} />
        <NoteMenu notes={notes} selectedIndex={0} />
        <NoteEditor />
      </main>
    </>
  )
}

export default HomePage
