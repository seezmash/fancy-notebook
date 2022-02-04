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

function initializeDatabase() {
  const db = getFirestore()

  // Get a single document
  // const bookRef = doc(db, 'books', 'HpMhemds5BtPtHqfoqc8')

  // getDoc(bookRef).then((doc) => {
  //   console.log(doc.data(), doc.id)
  // })

  // const unsubBook = onSnapshot(bookRef, (doc) => {
  //   console.log(doc.data(), doc.id)
  // })

  // ===== Notebooks =====

  const notebooksColRef = collection(db, 'books')

  const filteredColQuery = query(notebooksColRef, orderBy('createdAt'))

  // Get data once

  // getDocs(notebooksColRef)
  //   .then((snapshot) => {
  //     let books = []
  //     snapshot.docs.forEach((doc) => {
  //       books.push({ ...doc.data(), id: doc.id })
  //     })
  //     console.log(books)
  //   })
  //   .catch((err) => {
  //     console.log(err.message)
  //   })

  // Get initial data and on changes
  const unsubBooksCol = onSnapshot(filteredColQuery, (snapshot) => {
    let notebooks = []
    snapshot.docs.forEach((doc) => {
      notebooks.push({ ...doc.data(), id: doc.id })
    })
    console.log(notebooks)
  })

  // Add to a book to collection
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

  // deleting docs
  // const deleteBookForm = document.querySelector('.delete')
  // deleteBookForm.addEventListener('submit', (e) => {
  //   e.preventDefault()

  //   const docRef = doc(db, 'books', deleteBookForm.id.value)

  //   deleteDoc(docRef).then(() => {
  //     deleteBookForm.reset()
  //   })
  // })

  // update a document
  // const updateForm = document.querySelector('.update')
  // updateForm.addEventListener('submit', (e) => {
  //   e.preventDefault()

  //   const docRef = doc(db, 'books', updateForm.id.value)

  //   updateDoc(docRef, { title: 'This book title was updated, ey' }).then(() => {
  //     updateForm.reset()
  //   })
  // })
}

export { initializeDatabase }
