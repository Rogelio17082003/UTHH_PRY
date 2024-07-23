// Import the functions you need from the SDKs you need
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJgXEVRF9Kku6zK0DUqg15JkLylAzOKgo",
  authDomain: "notificaciones-5e417.firebaseapp.com",
  projectId: "notificaciones-5e417",
  storageBucket: "notificaciones-5e417.appspot.com",
  messagingSenderId: "978484214496",
  appId: "1:978484214496:web:f869d2d9ab4745a10dae85",
  measurementId: "G-RDQCGEV699"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);


