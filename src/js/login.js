// eslint-disable-next-line no-unused-vars
function submitForm() {
    if(validateUser(document.getElementById('existingUser').value, document.getElementById('existingPassword').value)) {
        window.open('src/html/Welcome.html', '_self')
    } else {
        alert("Incorrect username or password")
    }
}
const users = [
    {
        username: "Terrie",
        password: "TBick"
    },
    {
        username: "Greg",
        password: "GBick"
    },
    {
        username: "Molly",
        password: "MolBick"
    },
    {
        username: "Madison",
        password: "MadBick"
    },
    {
        username: "Mackenzie",
        password: "MackBick"
    },
];

 function validateUser(userName, password) {
    let isValidUser = users.filter(user => {
        return user.username === userName && user.password === password
    });
    return isValidUser.length > 0;
}
