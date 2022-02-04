import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

function initializeAuthentication() {
  const auth = getAuth()

  // signing users up
  const signupForm = document.querySelector('.signup')
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log('user created: ', cred.user)
        signupForm.reset()
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  // logging in and out
  const logoutButton = document.querySelector('.logout')
  logoutButton.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        console.log('the user signed out')
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  const loginForm = document.querySelector('.login')
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        // console.log('user logged in: ', cred.user)
        loginForm.reset()
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  // subscribing to auth changes
  const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user)
  })

  // unsubscribing from changes (auth & db)
  const unsubButton = document.querySelector('.unsub')
  unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubAuth()
    unsubBook()
    unsubBooksCol()
  })
}

export { initializeAuthentication }
