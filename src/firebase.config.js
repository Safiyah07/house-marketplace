// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDqXOqoV1UtyhULbpnv7xOo90GvoWG-EkQ',
	authDomain: 'house-marketplace-9be32.firebaseapp.com',
	projectId: 'house-marketplace-9be32',
	storageBucket: 'house-marketplace-9be32.appspot.com',
	messagingSenderId: '851949722431',
	appId: '1:851949722431:web:1695634b42c49ca663518a',
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()
