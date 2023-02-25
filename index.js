// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startBuyButton = document.getElementById('startBuy');
const startSellButton= document.getElementById('startSell');
const startLogOutButton= document.getElementById('logOut');


const guestbookContainer = document.getElementById('guestbook-container');
const buyContainer = document.getElementById('buy-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

// Add Firebase project configuration object here
// var firebaseConfig = {};
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg7WuG7cdZpWTYA7qDNLddQt8UiSHd8FY",
  authDomain: "the-gold-bank.firebaseapp.com",
  databaseURL: "https://the-gold-bank-default-rtdb.firebaseio.com",
  projectId: "the-gold-bank",
  storageBucket: "the-gold-bank.appspot.com",
  messagingSenderId: "548182857320",
  appId: "1:548182857320:web:3011f7cbe2a2d263bb0ddd",
  measurementId: "G-VG3DRYZ5CQ"
};
firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl){
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    }
  }
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

// Listen to RSVP button clicks
// startRsvpButton.addEventListener("click",
//  () => {
//   ui.start("#firebaseui-auth-container", uiConfig);
// });

firebase.auth().onAuthStateChanged((user)=> {
  if (user) {
    startLogOutButton.textContent = "Log Out";
    guestbookContainer.style.display = "show";
  }
  else {
    startLogOutButton.textContent = "Log In"
    guestbookContainer.style.display = "none";
  }
});

startLogOutButton.addEventListener("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
      startLogOutButton.textContent = "Log In";
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});

var buttonFlag=true;
startBuyButton.addEventListener("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      if(  buttonFlag=true )
      {
        startBuyButton.textContent="Buying";
        buttonFlag= false;
      } else {
        buttonFlag = true;
        startBuyButton.textContent="Cancel";
        
      }


       } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});


// ..
// Listen to the form submission
form.addEventListener("submit", (e) => {
 // Prevent the default form redirect
 e.preventDefault();
 // Write a new message to the database collection "guestbook"
 firebase.firestore().collection("guestbook").add({
   text: input.value,
   timestamp: Date.now(),
   name: firebase.auth().currentUser.displayName,
   userId: firebase.auth().currentUser.uid
 })
 // clear message input field
 input.value = ""; 
 // Return false to avoid redirect
 return false;
});


firebase.firestore().collection("guestbook")
.orderBy("timestamp","desc")
.onSnapshot((snaps) => {
 // Reset page
 guestbook.innerHTML = "";
 // Loop through documents in database
 snaps.forEach((doc) => {
   // Create an HTML entry for each document and add it to the chat
   const entry = document.createElement("p");
   entry.textContent = doc.data().name + ": " + doc.data().text;
   guestbook.appendChild(entry);
 });
});