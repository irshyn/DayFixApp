// <snippet_SiteJs>
const uri = 'api/v1/DayFix';
let dayfixes = [];
const DAYFIX_KEY = 'dayfix_jtw';
let jtw = '';
const TWIT_POSTED = 'The tweet has been successfully posted. To see it, click <a target="_blank" href="https://twitter.com/CatAndJoke">here</a>.';
const CANT_TWIT = 'Only logged-in users are allowed to post to Twitter.';

// to register the user
function register() {
    const name = document.getElementById("usernameRegister").value;
    const pswd = document.getElementById("passwordRegister").value;
    const email = document.getElementById("emailAddressRegister").value;

    if (!name || !pswd || !email) {
        document.getElementById("registerValidationError").innerHTML = "All fields are required.";
        return;
    }

    var newUser = {
        username: document.getElementById("usernameRegister").value,
        password: document.getElementById("passwordRegister").value,
        emailaddress: document.getElementById("emailAddressRegister").value
    };

    fetch('https://localhost:44338/api/v1/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (!response.ok) {
            response.text().then(function (text) {
                document.getElementById("registerValidationError").innerHTML = text;
                throw new Error("HTTP error " + response.status);
            });
        }
        else {
            return response.json();
        }        
    })
    .then(function(data) {
        jtw = data.token;
        localStorage.setItem(DAYFIX_KEY, jtw);
        _displayAuthButtons(true);
        document.getElementById("usernameRegister").value = '';
        document.getElementById("passwordRegister").value = '';
        document.getElementById("emailAddressRegister").value = '';
        $('#registerModal').modal('hide');
    })
    .catch(error => {
        console.error('Unable to register.', error);
        
    });
}

// to log in
function login() {
    var user = {
        username: document.getElementById("usernameLogIn").value,
        password: document.getElementById("passwordLogIn").value,
        emailaddress: ''
    };

    fetch('https://localhost:44338/api/v1/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(function (data) {
        jtw = data.token;
        localStorage.setItem(DAYFIX_KEY, jtw);
        _displayAuthButtons(true);
        document.getElementById("usernameLogIn").value = '';
        document.getElementById("passwordLogIn").value = '';
        $('#loginModal').modal('hide');
    })
    .catch(error => console.error('Unable to login.', error));
}

// to log out
function logout() {
    localStorage.removeItem(DAYFIX_KEY);
    _displayAuthButtons(false);
}

// to get all dayfixes
function getItems() {
    _renderNavbar();
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

// to add a new dayfix to the list
function addItem() {
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(() => {
            getItems();
        })
        .catch(error => console.error('Unable to add item.', error));
}

// to delete a specific item on the list
function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}


// will determine a valid token can be retrieved, and displays correspondent buttons in the nav bar
function _renderNavbar() {
    jtw = localStorage.getItem(DAYFIX_KEY);
    _displayAuthButtons(jtw != null && !tokenExpired(jtw));
}

// will  display "Register" and "Log In" or "Log Out" buttons depending on whether a valid token is found
function _displayAuthButtons(isLoggedIn) {
    const navBody = document.getElementById('authentication_bar');
    navBody.innerHTML = '';

    if (isLoggedIn) {
        navBody.innerHTML = '<button type="button" class="btn navbar-button navbar-btn" onclick="logout();">Log Out</button>';
    }
    else {
        navBody.innerHTML = '<button type="button" class="btn navbar-button navbar-btn" data-toggle="modal" data-target="#registerModal">Register</button><button type="button" class="btn navbar-button navbar-btn" data-toggle="modal" data-target="#loginModal">Log In</button>';
    }
}

// display all dayfix items
function _displayItems(data) {
    const dayFixesBody = document.getElementById('dayFixes');
    dayFixesBody.innerHTML = '';
    var html = '';

    data.forEach(item => {
        html += '<div class="dayfix-tile"><div class="img-container"><img class="cat-pic" src="' + item.catImage + '" alt="cat pic" /></div>';
        html += '<div class="joke-text">' + item.dadJoke + '</div><div class="row"><div class="col-md-6 tile-button">';
        html += '<button class="btn btn-sm btn-success" onclick="postToTwitter(' + item.id + ')">Post to Twitter</button></div>';
        html += '<div class="col-md-6 tile-button"><button class="btn btn-sm btn-danger" onclick="deleteItem(' + item.id + ')">Remove</button></div></div></div>';
    });

    dayFixesBody.innerHTML = html;
    dayfixes = data;    
}

// to send the post to twitter
function postToTwitter(fixId) {
    var jtw = localStorage.getItem(DAYFIX_KEY);
    fetch(`${uri}/TwitterPost/${fixId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jtw}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Authorized');
            displayMessage(TWIT_POSTED);
        }
        else if (response.status === 401) {
            console.log('Unauthorized');
            displayMessage(CANT_TWIT);
        }
    })
        .catch(function (error) {
            console.log('Error caught');
            displayMessage(error);
        });
}

// to display a message after a twit was posted / failed to be posted
function displayMessage(message) {
    var errorMessage = document.getElementById("resultMessage");
    errorMessage.style.display = "block";
    errorMessage.innerHTML = message;
}

// to determine whether a given token has expired
function tokenExpired(jtw) {
    const jwt_split = jtw.split('.');
    let content = atob(jwt_split[1]);
    const token = JSON.parse(content);
    const expDateTime = token.exp;
    return expDateTime < Date.now().toString().substring(0, 10);
}