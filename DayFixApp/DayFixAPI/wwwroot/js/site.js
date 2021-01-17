// <snippet_SiteJs>
const uri = 'api/v1/DayFix';
let dayfixes = [];
let jtw = '';

// to register the user
function register() {
    var newUser = {
        username: document.forms["registerForm"]["username"].value,
        password: document.forms["registerForm"]["password"].value,
        emailaddress: document.forms["registerForm"]["emailaddress"].value
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
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        jtw = data.token;
        localStorage.setItem('dayfix_jtw', jtw);
        document.getElementById("registerForm").style.display = "none";
    })
    .catch(error => console.error('Unable to register.', error));
}

// to register the user
function login() {
    var newUser = {
        username: document.forms["loginForm"]["username"].value,
        password: document.forms["loginForm"]["password"].value,
        emailaddress: ''
    };

    fetch('https://localhost:44338/api/v1/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(function (data) {
        jtw = data.token;
        localStorage.setItem('dayfix_jtw', jtw);
        document.getElementById("loginForm").style.display = "none";
    })
    .catch(error => console.error('Unable to register.', error));
}

function sendRequest() {
    fetch(`${uri}/GetValue`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jtw}`
        }
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log('authorized');
            }
            else if (response.status === 401) {
                console.log('Unauthorized');
            }
        })
        .catch(function (error) {
            console.log('Error caught');
        });
}

// To get all dayfixes
function getItems() {
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

//to delete a specific item on the list
function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}


function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'dayfix' : 'dayfixes';

    document.getElementById('counter').innerText = `You have ${itemCount} ${name} in your collection`;
}

// display all dayfix items
function _displayItems(data) {
    const tBody = document.getElementById('dayfixes');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let editButton = button.cloneNode(false);
        editButton.innerText = 'View';
        editButton.setAttribute('onclick', `displayViewForm(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode1 = document.createTextNode(item.catImage);
        td1.appendChild(textNode1);

        let td2 = tr.insertCell(1);
        let textNode2 = document.createTextNode(item.dadJoke);
        td2.appendChild(textNode2);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    dayfixes = data;
    jtw = localStorage.getItem('dayfix_jtw');
}

// to display the selected item with image rendered
function displayViewForm(id) {
    const item = dayfixes.find(item => item.id === id);
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("fixId").value = id;
    document.getElementById('catimg').innerHTML = '<img src="' + item.catImage + '" alt="Funny Cat" width=200>';
    document.getElementById('joke').innerHTML = '<span style="font-size:large">' + item.dadJoke + '</span>';
    document.getElementById('viewDayfix').style.display = 'block';
    document.getElementById('viewDayfix').style.margin = '10px 20px';
}

// to send the post to twitter
function postToTwitter() {
    var fixId = document.getElementById("fixId").value;
    fetch(`${uri}/TwitterPost/${fixId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(() => {
            displaySuccessMessage();
        })
        .catch(error => console.error('Unable to post this tweet.', error));
}

function displaySuccessMessage() {
    document.getElementById("successMessage").style.display = "block";
}

function showRegisterForm() {
    document.getElementById("registerForm").style.display = "block";
}

function showLoginForm() {
    document.getElementById("loginForm").style.display = "block";
}