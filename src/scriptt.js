document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

 fetch("http://localhost:8052/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body:
            "username=" + encodeURIComponent(username) +
            "&password=" + encodeURIComponent(password)

    })

    .then(response => response.text())

    .then(data => {

        document.getElementById("message").innerText = data;

    })

    .catch(error => {

        console.error(error);

        document.getElementById("message").innerText =
            "Backend connection failed";

    });

});