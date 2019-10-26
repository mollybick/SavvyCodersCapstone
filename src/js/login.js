// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-undef
const signInButton = document.querySelector("#signIn");
const signUpButton = document.querySelector("#signUp");


function addCategories(username, category) {
    // eslint-disable-next-line no-undef
    return db.collection('users').doc(username).collection('recipes')
        .doc(category).set({category}).then(() => true);
}


if(signInButton)
signInButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const validUsers = await getUsers();
    return submitForm(validUsers)
});


if(signUpButton)
signUpButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const validUsers = await getUsers();
    let username = document.getElementById('newUser').value;
    let password = document.getElementById('newPassword').value;
    let reenterPassword = document.getElementById('reenterPassword').value;
    if(validateNewUser(validUsers, username, password, reenterPassword)) {
        await createUser(username, password);
        alert("New user successfully created");
        document.getElementById('newUser').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('reenterPassword').value = '';
    }
});

function createUser(userName, password) {
    // eslint-disable-next-line no-undef
        return db.collection('users').doc(userName).set({
            username:userName,
            password
        }).then(async () => {
            await addCategories(userName, 'breakfast');
            await addCategories(userName, 'lunch');
            await addCategories(userName, 'dinner');
            return true;
    });
}

function submitForm(validUsers) {
    let username = document.getElementById('existingUser').value;
    let password = document.getElementById('existingPassword').value;
    if(validateUser(validUsers, username, password)) {
        let openPage = 'src/html/Welcome.html?username=' + username;
        window.open(openPage, '_self')
    } else {
        alert("Incorrect username or password")
    }
}

function getUsers() {
    // eslint-disable-next-line no-undef
    return db.collection('users').get().then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
            users.push(doc.data());
        });
        return users;
    });
}

function validateNewUser(validUsers, username, password, reenterPassword) {
     if(isNewUserName(validUsers, username)) {
         if(password === reenterPassword) {
             return true;
         }
         alert("Password don't match");
         return false;
     }
     alert("Username already exists, try a new one");
     return false;
}

function isNewUserName(validUsers, newUsername){
    return validUsers.filter(user => user.username === newUsername).length === 0;
}

function validateUser(users, userName, password) {
    let isValid = users.filter(user => {
        return user.username === userName && user.password === password
    });
    return isValid.length>0
}
