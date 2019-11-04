// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-undef
const signInButton = document.querySelector("#signIn");
const signUpButton = document.querySelector("#signUp");

// This event listener handles signing user into account
// Finds list of valid users and if user matches one, signs user in
if (signInButton)
  signInButton.addEventListener("click", async e => {
    e.preventDefault();
    const validUsers = await getUsers();
    return submitForm(validUsers);
  });


  // This event listener handles creating new user
  // Used an async function to allow awaiting on get users and creating users call to firebase
if (signUpButton)
  signUpButton.addEventListener("click", async e => {
    e.preventDefault();
    //retrieving all current users. Await until get users call to firebase is complete
    const validUsers = await getUsers();
    let username = document.getElementById("newUser").value;
    let password = document.getElementById("newPassword").value;
    let reenterPassword = document.getElementById("reenterPassword").value;
    // Validate new users
    if (validateNewUser(validUsers, username, password, reenterPassword)) {
      await createUser(username, password);
      alert("New user successfully created");
      // empties input fields after new user is successfully created
      document.getElementById("newUser").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("reenterPassword").value = "";
    }
  });

  // creates user by using firebase syntax to add docs to a collection with data user inputs
function createUser(userName, password) {
  // eslint-disable-next-line no-undef
  return db
    .collection("users")
    .doc(userName)
    .set({
      username: userName,
      password
    })
    .then(async () => {
      return true;
    });
}

// Validates user credentials
function submitForm(validUsers) {
  let username = document.getElementById("existingUser").value;
  let password = document.getElementById("existingPassword").value;
  if (validateUser(validUsers, username, password)) {
      // If user is valid, opens welcome page with username in the URL
    let openPage = "src/html/Welcome.html?username=" + username;
    window.open(openPage, "_self");
  } else {
    alert("Incorrect username or password");
  }
}

// Get asks for data to come back. Then tells what to do with data after you get it back
// Snapshot is the value that you get back from Firebase
// Doc data gets data from each user in the collection
// push adds data for users one at a time to the array users
function getUsers() {
  // eslint-disable-next-line no-undef
  return db
    .collection("users")
    .get()
    .then(snapshot => {
      let users = [];
      snapshot.docs.forEach(doc => {
        users.push(doc.data());
      });
      return users;
    });
}

// Upon signing up, checks if user is existing and if pw and reenter pw match
function validateNewUser(validUsers, username, password, reenterPassword) {
  if (isNewUserName(validUsers, username)) {
    if (password === reenterPassword) {
      return true;
    }
    alert("Password don't match");
    return false;
  }
  alert("Username already exists, try a new one");
  return false;
}

// Checks if a username already exits
function isNewUserName(validUsers, newUsername) {
  return validUsers.filter(user => user.username === newUsername).length === 0;
}

// Validates username and password
function validateUser(users, userName, password) {
  let isValid = users.filter(user => {
      // && checks that both username and password match
    return user.username === userName && user.password === password;
  });
  return isValid.length > 0;
}
