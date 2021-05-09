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
//auth.useEmulator("http://localhost:9099");

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


var db = firebase.firestore();
//db.useEmulator("localhost", 8080);

var error_mssg;
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
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) == true) {
            return true;
        } else {
            Events.show('reg_email_err', 'block');
            return false;
        }
    }, 
    valid_password: function(password) {
        let psswd_regex= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (psswd_regex.test(password) == true) { 
            return true;
        } else { 
            Events.show('reg_password_err', 'block');
            return false;
        }
    }, 
    match_password: function(password, confirm_password) {
        if (password == confirm_password) {
            return true;
        } else {
            Events.show('reg_match_err', 'block');
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
        if (errors.length == 0) {
            let email = form_values["email"];
            let password = form_values["password"];
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    user = userCredential.user;
                    localStorage.setItem('chiefs-talk-session', JSON.stringify(user));
                    //Events.hide('register'); 
                    //Events.hide("login-register-btn");
                    //Events.show('profile-menu', 'block');
                    window.location.replace("http://127.0.0.1:5500/profile.html");
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
                Auth.user_state('logged-in');
            })
            .catch((error) => {
                var errorCode = error.code;
                error_mssg = error.message;
                window.alert(error_mssg);
            });
    }, 
    logout: function() {
        firebase.auth().signOut().then(() => {
                localStorage.removeItem('chiefs-talk-session');
                window.location.replace("http://127.0.0.1:5500/index.html");
                Auth.user_state('logged-out'); 
            }).catch((error) => {
                // An error happened.
            });
    },
    user_state: function(state) {
        if (state == 'logged-in') {
            Events.hide("login-register-btn");
            Profile.set_profile_menu();
            Events.show('profile-menu', 'block');
        } else if (state == 'logged-out') {
            Events.hide("profile-menu");
            Events.show("login-register-btn", "inline-block");
        }
    }
}
var Events = {
    hide: function(id) {
        document.getElementById(id).style.display = "none";
        Events.hide_errors();
    }, 
    show: function(id, display) {
        document.getElementById(id).style.display = display;
    },
    go_back: function() {
        window.history.back();
    }, 
    hide_errors: function() {
        let errors = document.getElementsByClassName('error');
        for (let i=0; i<errors.length; i++) {
            errors[i].style.display = "none";
        }
    },
    user_state: function(){
        if (user != null) {
            Events.hide("login-register-btn");
            Profile.set_profile_menu();
            Events.show('profile-menu', 'block');
        } else {
            Events.hide("profile-menu");
            Events.show("login-register-btn", "inline-block");
        }
    }, 
    remove_element: function(id) {
        document.getElementById(id).remove();
    },
    change_color_primary: function(id) {
        document.getElementById(id).style.backgroundColor = "#E31837";
    },
    change_color_secondary: function(id) {
        document.getElementById(id).style.backgroundColor = "#FFB81C";
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
        let anchors = document.getElementsByClassName("anchor-main");
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
    },
    expand_dropdown: function() {
        let dropdown = document.getElementById("club-dropdown");
        dropdown.style.display = "block";
    },
    collapse_dropdown: function() {
        let dropdown = document.getElementById("club-dropdown");
        dropdown.style.display = "none";
    },
    subforum_nav: function(id, collection, container) {
        let anchors = document.getElementById("nav-subforums").getElementsByTagName("a");
        Object.entries(anchors).forEach(([key, value]) => {
            if (value.id == id) {
                Events.change_color_secondary(value.id);
                Thread.get_threads(collection, container);
                Events.show(value.dataset.thread, 'flex');
                Events.show(value.dataset.button, 'block');
            } else {
                Events.change_color_primary(value.id);
                Events.hide(value.dataset.thread);
                Events.hide(value.dataset.button);
                Object.entries(document.getElementById(value.dataset.thread).getElementsByTagName("div")).forEach(([key2, value2]) => {
                    value2.remove();
                });
            }
        });
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
var Thread = {
    get_threads: function(collection, container) {
        db.collection(collection).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let thread = {
                    id: doc.id,
                    data: doc.data()
                }
                Thread.display_threads(collection, thread, container); 
            });
        });
    },
    get_content: function(collection, thread_id) {
        var docRef = db.collection(collection).doc(thread_id);
        docRef.get().then((doc) => {
            if (doc.exists) {
                let content = doc.data();
                Thread.display_content(thread_id, content);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    display_threads: function(collection, threads, container) {
        let parent = document.getElementById(container);
        let thread = document.createElement("div");
        thread.id = threads.id;
        thread.className = "thread";
        thread.dataset.db_collection = collection;
        thread.setAttribute("onclick", "Thread.get_content(this.dataset.db_collection, this.id)");
        let content = document.createElement("div");
        let title = document.createElement("p");
        let user = document.createElement("p");
        let date = document.createElement("p");
        title.innerHTML = threads['data']['title'];
        user.innerHTML = "Posted by: " + threads['data']['postedBy'];
        date_raw = new Date(threads['data']['date'].seconds * 1000 + threads['data']['date'].nanoseconds/1000000);
        date_formatted = (date_raw.getMonth() + 1)
                            + "/"
                            + date_raw.getDate()
                            + "/"
                            + date_raw.getFullYear();
        date.innerHTML = date_formatted;
        thread.appendChild(title);
        thread.appendChild(user);
        thread.appendChild(date);
        thread.appendChild(content);
        parent.appendChild(thread);
    }, 
    display_content: function(id, thread_content) {
        let parent = document.getElementsByTagName("body");
        let parent_container = document.createElement("div");
        let content_container= document.createElement("div");
        let exit = document.createElement("button");
        let title = document.createElement("h2");
        let content = document.createElement("p");
        parent_container.id= "content_container" + `_${id}`;
        parent_container.className = "content_container";
        content_container.className = "content";
        exit.dataset.parent_id = "content_container" + `_${id}`;
        exit.setAttribute("onclick", "Events.hide(this.dataset.parent_id), Events.remove_element(this.dataset.parent_id)");
        exit.innerHTML = "X";
        title.innerHTML = thread_content['title'];
        content.innerHTML = thread_content['content'];
        content_container.appendChild(exit);
        content_container.appendChild(title);
        content_container.appendChild(content);
        parent_container.appendChild(content_container);
        parent[0].appendChild(parent_container);
        parent_container.style.display = "flex";
    }
}
var Post = {
    display_new_post: function(id, collection) {
        let parent = document.getElementsByTagName("body");
        let parent_container = document.createElement("div");
        let post_container= document.createElement("div");
        let post_form = document.createElement("div");
        let exit = document.createElement("button");
        let title = document.createElement("input");
        let body = document.createElement("textarea");
        let post_btn = document.createElement("button");
        parent_container.id= "post_container" + `_${id}`;
        parent_container.className = "post_container";
        post_container.className = "post";
        post_form.className = "post_form";
        exit.dataset.parent_id = "post_container" + `_${id}`;
        exit.setAttribute("onclick", "Events.hide(this.dataset.parent_id), Events.remove_element(this.dataset.parent_id)");
        exit.innerHTML = "X";
        exit.className = "exit_post";
        title.type = "text";
        title.id = "post_title";
        body.className = "post_body";
        body.id = "post_content";
        post_btn.id = "post_btn";
        post_btn.dataset.parent_id = "post_container" + `_${id}`;
        post_btn.setAttribute("onclick", "Post.post('" + `${collection}` + "'" + "), Events.hide(this.dataset.parent_id), Events.remove_element(this.dataset.parent_id)");
        post_btn.innerHTML = 'Post';
        post_form.appendChild(exit);
        post_form.appendChild(title);
        post_form.appendChild(body);
        post_container.appendChild(post_form);
        post_container.appendChild(post_btn);
        parent_container.appendChild(post_container);
        parent[0].appendChild(parent_container);
        parent_container.style.display = "flex"; 
    },
    post: function(collection) {
        let title = document.getElementById('post_title').value;
        let post_content = document.getElementById('post_content').value;
        let time = firebase.firestore.FieldValue.serverTimestamp(); 
        if (user === undefined) {
            error_mssg = "Must be logged in to create a post."
            window.alert(error_mssg);
        } else if (title == '' || post_content == '') {
            error_mssg = "Title and Post cannot be left blank."
            window.alert(error_mssg);
        } else {
            let posted_by = user.email;
            db.collection(collection).doc().set({
                postedBy: posted_by,
                title: title,
                content: post_content,
                date: time 
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
    }
}