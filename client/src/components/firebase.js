import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyDNlZND5O1h_2qwDEKZDXurVaZglwOrmpg",
    authDomain: "my-own-instagram-c06e8.firebaseapp.com",
    databaseURL: "https://my-own-instagram-c06e8.firebaseio.com",
    projectId: "my-own-instagram-c06e8",
    storageBucket: "my-own-instagram-c06e8.appspot.com",
    messagingSenderId: "13816304935",
    appId: "1:13816304935:web:607d5a3221b5070ee20502",
    measurementId: "G-JT2WNFLLJJ",
    storageBucket: "gs://my-own-instagram-c06e8.appspot.com"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase;