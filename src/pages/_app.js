// styles
import '../styles/app.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyBUIU-2NlOUut9dRfmJjKqEdsh7Hufgy8A',
//   authDomain: 'notebook-bear.firebaseapp.com',
//   projectId: 'notebook-bear',
//   storageBucket: 'notebook-bear.appspot.com',
//   messagingSenderId: '461915390043',
//   appId: '1:461915390043:web:7b9f3a30b22bfd263f3f7e'
// }
const firebaseConfig = {
  apiKey: 'AIzaSyCTZlOThBwK0jrNYciHDDY9bKN3xHZLK-Q',
  authDomain: 'fancy-notebook.firebaseapp.com',
  projectId: 'fancy-notebook',
  storageBucket: 'fancy-notebook.appspot.com',
  messagingSenderId: '733010307732',
  appId: '1:733010307732:web:add547c8e0bedfeeb6e281'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const NextApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default NextApp
