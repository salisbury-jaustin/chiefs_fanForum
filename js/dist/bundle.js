/*
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
require("firebase/analytics");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
*/

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field

const firebaseConfig = {
    apiKey: "AIzaSyBPRfUO29MHnsmWuHOukPSyOlSLe8HZBUg",
    authDomain: "chiefsforum-92f64.firebaseapp.com",
    projectId: "chiefsforum-92f64",
    storageBucket: "chiefsforum-92f64.appspot.com",
    messagingSenderId: "880449501027",
    appId: "1:880449501027:web:033d2153f4e627bd99c556",
    measurementId: "G-WDESN8E51D"
};


firebase.initializeApp(firebaseConfig);
firebase.analytics();

/*
const functions = require('firebase-functions');
*/

var auth = firebase.auth();
auth.useEmulator("http://localhost:9099");

var session = localStorage.getItem('chiefs-talk-session');
if (session != null) {
  session = JSON.parse(session); 
  var user = session;
  var user_name = user.displayName;
  var user_email = user.email;
  var uid = user.uid; 
} else {
  var user;
}

/*
firebase.auth().onAuthStateChanged((user) => { // working on listening for auth changes
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      Events.hide("login-register-btn");
      Profile.set_profile_menu();
      Events.show('profile-menu', 'block');
    } else {
      // User is signed out
      Events.hide("profile-menu");
      Events.show("login-register-btn", "inline-block");
    }
  });
*/

var db = firebase.firestore();
db.useEmulator("localhost", 8080);
var Auth = {
    get_values: function(form_id) { 
        let form_element = document.getElementById(form_id);
        let input = form_element.getElementsByTagName("input");
        let values = {};
        for (let i=0; i<input.length; i++) {
            values[input[i].name] = input[i].value;
        }
        return values;
    },
    valid_email: function(email) {
     if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return (true)
      } else {
        return (false)
      }
    }, 
    valid_password: function(password) {
        let psswd_regex= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (password.match(psswd_regex)) { 
            return true;
        } else { 
            return false;
        }
    }, 
    match_password: function(password, confirm_password) {
        if (password == confirm_password) {
            return true;
        } else {
            return false;
        }
    }, 
    validate_form: function() {
        let errors = [];
        for (let i=0; i<arguments.length; i++) {
            if (arguments[i] == false) {
                errors.push(arguments[i]);
            } 
        } 
        return errors;
    },
    create_account: function() {
        let form_values = Auth.get_values("register-form");
        let email_result = Auth.valid_email(form_values["email"]);
        let password_result = Auth.valid_password(form_values["password"]);
        let match_result = Auth.match_password(form_values["password"], form_values["confirm-password"]);
        let errors = Auth.validate_form(email_result, password_result, match_result);
        if (errors.length > 0) {
            return errors;
        } else {
            let email = form_values["email"];
            let password = form_values["password"];
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    user = userCredential.user;
                    localStorage.setItem('chiefs-talk-session', JSON.stringify(user));
                    Events.hide('register'); 
                    window.location.replace("http://127.0.0.1:5500/profile.html");
                    Events.hide("login-register-btn");
                    Events.show('profile-menu', 'block');
                    })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                });
        }
    },
    login: function() {
        let form_values = Auth.get_values("login-form");
        let email = form_values["user-email"];
        let password = form_values["user-password"];
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                user = userCredential.user;
                localStorage.setItem('chiefs-talk-session', JSON.stringify(user));
                Events.hide("user-login");
                Events.hide("login-register-btn");
                Profile.set_profile_menu();
                Events.show('profile-menu', 'block');
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }, 
    logout: function() {
        firebase.auth().signOut().then(() => {
                localStorage.removeItem('chiefs-talk-session');
                window.location.replace("http://127.0.0.1:5500/index.html");
                Events.hide("profile-menu");
                Events.show("login-register-btn", "inline-block");
            }).catch((error) => {
                // An error happened.
            });
    }
}
var Events = {
    hide: function(id) {
        document.getElementById(id).style.display = "none";
    }, 
    show: function(id, display) {
        document.getElementById(id).style.display = display;
    },
    go_back: function() {
        window.history.back();
    }
}
var Nav = {

    // url regular expression variables
    url_regexp: {
        home: new RegExp("index.html"),
        redzone: new RegExp("redzone.html"),
        subforums: new RegExp("subforums.html"),
        club: new RegExp("club")
    },
    // changes the color of the active link onload
    main_nav_onload: function(id) {
        let anchors = document.getElementById('nav-main').getElementsByTagName('a');
        for (const key in Nav.url_regexp) {
            if (Nav.url_regexp[key].test(window.location.href)) {
                for (let i=0; i<anchors.length; i++) {
                    if (Nav.url_regexp[key].test(anchors[i].href)) {
                        anchors[i].style.backgroundColor = '#FFB81C';
                    } else {
                        anchors[i].style.backgroundColor = '#E31837';
                    }
                }
            }
        }
    }
}
var Profile = {
    set_profile_menu: function() {
        if (user.displayName) {
           document.getElementById('menu-username').innerHTML = user.displayName;
        } else {
            document.getElementById('menu-username').innerHTML = user.email;
        }
    },
    set_profile_page: function() {
        document.getElementById('user-huddle').style.display = 'flex';  
        document.getElementById('header-username').innerHTML = user_email;
        console.log(user_name);
    }, 
    nav: function(anchor_id, content_id) {
        let anchors = document.getElementById('nav-user').getElementsByTagName('a');
        let sections = document.getElementById('profile').getElementsByTagName('div');
        for (let i=0; i<anchors.length; i++) {
            if (anchors[i].getAttribute('data-active') == 1) {
                anchors[i].style.backgroundColor = '#E31837';
                anchors[i].setAttribute('data-active', '0');
            } 
        }
        for (let i=0; i<sections.length; i++) {
            if (sections[i].style.display === 'flex') {
                sections[i].style.display = 'none';
            }
        }       

        document.getElementById(anchor_id).style.backgroundColor = '#FFB81C';
        document.getElementById(anchor_id).setAttribute('data-active', '1');
        document.getElementById(content_id).style.display = 'flex';

    }
}