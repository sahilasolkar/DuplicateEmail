import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyDSm99N3YtLuA8kIn1FnhG2n8miWIUmFQA",
  authDomain: "emailduplicatio-hr-project.firebaseapp.com",
  databaseURL: "https://emailduplicatio-hr-project-default-rtdb.firebaseio.com",
  projectId: "emailduplicatio-hr-project",
  storageBucket: "emailduplicatio-hr-project.appspot.com",
  messagingSenderId: "381617630773",
  appId: "1:381617630773:web:9303028574bd77b1070b7c"
  // Add your Firebase configuration here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

export { firebase, db };