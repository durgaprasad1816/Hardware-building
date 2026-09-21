// Get the registration form

const form = document.getElementById("registrationForm");


// When user clicks Register Patient

form.addEventListener("submit", function(event) {

    // Stop normal form submission

    event.preventDefault();


    // Get values from HTML fields

    const fullName =
        document.getElementById("fullName").value.trim();

    const age =
        document.getElementById("age").value;

    const gender =
        document.getElementById("gender").value;

    const bloodGroup =
        document.getElementById("bloodGroup").value;

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const emergencyContact =
        document.getElementById("emergencyContact").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const symptoms =
        document.getElementById("symptoms").value.trim();


    // Create patient object

    const patient = {

        fullName: fullName,

        age: age,

        gender: gender,

        bloodGroup: bloodGroup,

        phone: phone,

        email: email,

        emergencyContact: emergencyContact,

        address: address,

        symptoms: symptoms
    };


    // Display data in browser console

    console.log("Patient Details:");

    console.log(patient);


    /*
       BACKEND CONNECTION

       Later your Java backend will receive
       this patient object.

       The URL will be changed according
       to the Java backend program.
    */


    fetch("http://localhost:8080/register", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(patient)

    })


    .then(function(response) {

        return response.text();

    })


    .then(function(data) {

        console.log(data);


        showMessage(
            "Patient registered successfully!",
            "success"
        );


        // Clear form

        form.reset();

    })


    .catch(function(error) {

        console.error(
            "Backend connection error:",
            error
        );


        showMessage(
            "Backend is not connected. Please start the Java backend.",
            "error"
        );

    });

});


// Show message function

function showMessage(message, type) {

    const messageBox =
        document.getElementById("message");


    messageBox.textContent = message;


    messageBox.className =
        "message " + type;

}