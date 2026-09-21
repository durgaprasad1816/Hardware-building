

const orderForm = document.getElementById("orderForm");
const customerName = document.getElementById("customerName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const address = document.getElementById("address");
const paintName = document.getElementById("paintName");
const paintType = document.getElementById("paintType");
const color = document.getElementById("color");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const totalAmount = document.getElementById("totalAmount");

const placeOrderButton =
    document.getElementById("placeOrderButton");

const message =
    document.getElementById("message");

const otpSection =
    document.getElementById("otpSection");

const otp =
    document.getElementById("otp");

const verifyOtpButton =
    document.getElementById("verifyOtpButton");

const otpMessage =
    document.getElementById("otpMessage");

const successSection =
    document.getElementById("successSection");

const successMessage =
    document.getElementById("successMessage");


/* =====================================================
   JAVA BACKEND
===================================================== */

const BACKEND_URL =
    "http://localhost:8052";


/* =====================================================
   MSG91 CONFIGURATION
===================================================== */

/*
   IMPORTANT:

   Replace these two values with the values from
   your MSG91 OTP Widget.

   Do NOT put your MSG91 AuthKey here.
*/

const MSG91_WIDGET_ID =
    "YOUR_WIDGET_ID";

const MSG91_TOKEN_AUTH =
    "YOUR_WIDGET_TOKEN";


/* =====================================================
   ORDER ID
===================================================== */

let orderId = null;


/* =====================================================
   OTP TYPE
===================================================== */

let selectedOtpType = null;


/* =====================================================
   TOTAL CALCULATION
===================================================== */

quantity.addEventListener(
    "input",
    calculateTotal
);

price.addEventListener(
    "input",
    calculateTotal
);


function calculateTotal() {

    const quantityValue =
        Number(quantity.value);

    const priceValue =
        Number(price.value);

    if (
        quantityValue > 0 &&
        priceValue >= 0
    ) {

        const total =
            quantityValue * priceValue;

        totalAmount.value =
            total.toFixed(2);

    } else {

        totalAmount.value = "";

    }
}


/* =====================================================
   PHONE NUMBER
===================================================== */

function normalizePhone(phoneNumber) {

    let value =
        phoneNumber.trim();

    /*
       Remove spaces, brackets and hyphens.
    */

    value =
        value.replace(
            /[\s()-]/g,
            ""
        );


    /*
       Remove + from +91...
    */

    if (
        value.startsWith("+")
    ) {

        value =
            value.substring(1);

    }


    /*
       Convert 10 digit Indian number
       into 91XXXXXXXXXX
    */

    if (
        value.length === 10 &&
        /^[6-9]\d{9}$/.test(value)
    ) {

        value =
            "91" + value;

    }


    return value;
}


/* =====================================================
   CHECK MSG91
===================================================== */

function checkMSG91() {

    if (
        typeof window.initSendOTP !== "function"
    ) {

        console.error(
            "MSG91 initSendOTP() is not available."
        );

        return false;
    }


    if (
        typeof window.sendOtp !== "function"
    ) {

        console.error(
            "MSG91 sendOtp() is not available."
        );

        return false;
    }


    return true;
}


/* =====================================================
   INITIALIZE MSG91
===================================================== */

function initializeMSG91() {

    console.log(
        "Checking MSG91..."
    );


    /*
       Check whether MSG91 script loaded.
    */

    if (
        typeof window.initSendOTP !== "function"
    ) {

        console.error(
            "MSG91 provider script is not loaded."
        );

        message.textContent =
            "MSG91 service is not loaded.";

        return;
    }


    /*
       Check placeholder values.
    */

    if (
        MSG91_WIDGET_ID === "YOUR_WIDGET_ID"
    ) {

        console.error(
            "MSG91 Widget ID has not been configured."
        );

        message.textContent =
            "MSG91 Widget ID is not configured.";

        return;
    }


    if (
        MSG91_TOKEN_AUTH === "YOUR_WIDGET_TOKEN"
    ) {

        console.error(
            "MSG91 Token Auth has not been configured."
        );

        message.textContent =
            "MSG91 Token Auth is not configured.";

        return;
    }


    /*
       MSG91 configuration.
    */

    const configuration = {

        widgetId:
            MSG91_WIDGET_ID,

        tokenAuth:
            MSG91_TOKEN_AUTH,

        identifier:
            "",

        exposeMethods:
            true,

        captchaRenderId:
            "",

        success:
            function(data) {

                console.log(
                    "MSG91 initialization successful:",
                    data
                );

            },

        failure:
            function(error) {

                console.error(
                    "MSG91 initialization failed:",
                    error
                );

            }

    };


    try {

        window.initSendOTP(
            configuration
        );

        console.log(
            "MSG91 Widget initialization requested."
        );

    }

    catch (error) {

        console.error(
            "MSG91 initialization error:",
            error
        );

        message.textContent =
            "MSG91 initialization failed.";

    }
}


/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener(
    "load",
    function() {

        initializeMSG91();

    }
);


/* =====================================================
   PLACE ORDER
===================================================== */

orderForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        message.textContent = "";
        otpMessage.textContent = "";


        /* ---------------------------------------------
           SELECT OTP TYPE
        --------------------------------------------- */

        const selected =
            document.querySelector(
                'input[name="otpType"]:checked'
            );


        if (!selected) {

            message.textContent =
                "Please select Phone or Email.";

            return;
        }


        selectedOtpType =
            selected.value;


        /* ---------------------------------------------
           PHONE
        --------------------------------------------- */

        const phoneNumber =
            normalizePhone(
                phone.value
            );


        if (
            phoneNumber === ""
        ) {

            message.textContent =
                "Please enter phone number.";

            phone.focus();

            return;
        }


        /*
           Validate Indian number.
        */

        if (
            !/^91[6-9]\d{9}$/.test(
                phoneNumber
            )
        ) {

            message.textContent =
                "Enter a valid Indian mobile number.";

            phone.focus();

            return;
        }


        /* ---------------------------------------------
           EMAIL
        --------------------------------------------- */

        const emailValue =
            email.value.trim();


        if (
            selectedOtpType === "EMAIL"
            &&
            emailValue === ""
        ) {

            message.textContent =
                "Please enter email address.";

            email.focus();

            return;
        }


        /* ---------------------------------------------
           QUANTITY
        --------------------------------------------- */

        const quantityValue =
            Number(quantity.value);


        if (
            !Number.isInteger(quantityValue)
            ||
            quantityValue <= 0
        ) {

            message.textContent =
                "Quantity must be greater than 0.";

            quantity.focus();

            return;
        }


        /* ---------------------------------------------
           PRICE
        --------------------------------------------- */

        const priceValue =
            Number(price.value);


        if (
            !Number.isFinite(priceValue)
            ||
            priceValue < 0
        ) {

            message.textContent =
                "Please enter a valid price.";

            price.focus();

            return;
        }


        /* ---------------------------------------------
           TOTAL
        --------------------------------------------- */

        const totalValue =
            quantityValue * priceValue;


        totalAmount.value =
            totalValue.toFixed(2);


        /* ---------------------------------------------
           ORDER DATA
        --------------------------------------------- */

        const orderData = {

            customerName:
                customerName.value.trim(),

            phone:
                phoneNumber,

            email:
                emailValue,

            address:
                address.value.trim(),

            paintName:
                paintName.value.trim(),

            paintType:
                paintType.value,

            color:
                color.value.trim(),

            quantity:
                quantityValue,

            price:
                priceValue,

            totalAmount:
                totalValue,

            otpType:
                selectedOtpType
        };


        console.log(
            "Sending order to Java:",
            orderData
        );


        /* ---------------------------------------------
           DISABLE PLACE ORDER
        --------------------------------------------- */

        placeOrderButton.disabled =
            true;

        placeOrderButton.textContent =
            "Saving Order...";


        /* ---------------------------------------------
           JAVA BACKEND
        --------------------------------------------- */

        fetch(
            BACKEND_URL + "/place-order",
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        orderData
                    )
            }
        )


        .then(
            function(response) {

                if (
                    !response.ok
                ) {

                    throw new Error(
                        "Java backend returned HTTP "
                        +
                        response.status
                    );
                }


                return response.json();

            }
        )


        .then(
            function(data) {

                console.log(
                    "Java response:",
                    data
                );


                if (
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Order could not be saved."
                    );
                }


                /*
                   Save generated order ID.
                */

                orderId =
                    data.orderId;


                message.textContent =
                    "Order saved. Sending OTP...";


                /*
                   Send OTP through MSG91.
                */

                sendMSG91OTP(
                    phoneNumber,
                    selectedOtpType
                );

            }
        )


        .catch(
            function(error) {

                console.error(
                    "Order error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Unable to connect to Java backend.";

            }
        )


        .finally(
            function() {

                placeOrderButton.disabled =
                    false;

                placeOrderButton.textContent =
                    "Place Order";

            }
        );

    }
);


/* =====================================================
   SEND MSG91 OTP
===================================================== */

function sendMSG91OTP(
    phoneNumber,
    otpType
) {

    console.log(
        "Starting MSG91 OTP..."
    );


    /* ---------------------------------------------
       CHECK SDK
    --------------------------------------------- */

    if (
        !checkMSG91()
    ) {

        message.textContent =
            "MSG91 OTP service is not available.";

        return;
    }


    /* ---------------------------------------------
       SELECT IDENTIFIER
    --------------------------------------------- */

    let identifier = "";


    if (
        otpType === "PHONE"
    ) {

        identifier =
            phoneNumber;

    }

    else if (
        otpType === "EMAIL"
    ) {

        identifier =
            email.value.trim();

    }


    if (
        identifier === ""
    ) {

        message.textContent =
            "OTP destination is empty.";

        return;
    }


    console.log(
        "OTP identifier:",
        identifier
    );


    /* ---------------------------------------------
       SEND OTP
    --------------------------------------------- */

    try {

        window.sendOtp(

            identifier,


            /* SUCCESS */
            function(data) {

                console.log(
                    "MSG91 OTP sent successfully:",
                    data
                );


                message.textContent =
                    "OTP sent successfully.";


                otpSection.style.display =
                    "block";


                otp.value =
                    "";


                otpMessage.textContent =
                    "Enter the OTP received on your "
                    +
                    (
                        otpType === "PHONE"
                        ? "phone."
                        : "email."
                    );

            },


            /* FAILURE */
            function(error) {

                console.error(
                    "MSG91 OTP ERROR:",
                    error
                );


                message.textContent =
                    "MSG91 could not send OTP. Check browser Console for the exact error.";


                otpSection.style.display =
                    "none";

            }

        );

    }

    catch (error) {

        console.error(
            "MSG91 sendOtp exception:",
            error
        );


        message.textContent =
            "MSG91 OTP request failed.";

    }
}


/* =====================================================
   VERIFY OTP
===================================================== */

verifyOtpButton.addEventListener(
    "click",
    function() {

        const enteredOtp =
            otp.value.trim();


        /* ---------------------------------------------
           OTP EMPTY
        --------------------------------------------- */

        if (
            enteredOtp === ""
        ) {

            otpMessage.textContent =
                "Please enter OTP.";

            otp.focus();

            return;
        }


        /* ---------------------------------------------
           OTP FORMAT
        --------------------------------------------- */

        if (
            !/^\d{6}$/.test(
                enteredOtp
            )
        ) {

            otpMessage.textContent =
                "Please enter a valid 6-digit OTP.";

            otp.focus();

            return;
        }


        /* ---------------------------------------------
           ORDER ID
        --------------------------------------------- */

        if (
            orderId === null
        ) {

            otpMessage.textContent =
                "Order ID is missing.";

            return;
        }


        /* ---------------------------------------------
           MSG91 VERIFY FUNCTION
        --------------------------------------------- */

        if (
            typeof window.verifyOtp !== "function"
        ) {

            otpMessage.textContent =
                "MSG91 verification service is not loaded.";

            console.error(
                "window.verifyOtp() is not available."
            );

            return;
        }


        /* ---------------------------------------------
           DISABLE BUTTON
        --------------------------------------------- */

        verifyOtpButton.disabled =
            true;

        verifyOtpButton.textContent =
            "Verifying...";


        otpMessage.textContent =
            "Verifying OTP...";


        /* ---------------------------------------------
           VERIFY OTP
        --------------------------------------------- */

        try {

            window.verifyOtp(

                enteredOtp,


                /* SUCCESS */
                function(data) {

                    console.log(
                        "MSG91 verification success:",
                        data
                    );


                    const accessToken =
                        getAccessToken(
                            data
                        );


                    if (
                        accessToken === ""
                    ) {

                        console.error(
                            "MSG91 response did not contain an access token.",
                            data
                        );


                        otpMessage.textContent =
                            "OTP verified, but access token was not received.";


                        verifyOtpButton.disabled =
                            false;

                        verifyOtpButton.textContent =
                            "Verify OTP";

                        return;
                    }


                    /*
                       Send result to Java.
                    */

                    confirmOrderWithJava(
                        orderId,
                        accessToken
                    );

                },


                /* FAILURE */
                function(error) {

                    console.error(
                        "MSG91 verification failed:",
                        error
                    );


                    otpMessage.textContent =
                        "Invalid OTP. Please try again.";


                    verifyOtpButton.disabled =
                        false;

                    verifyOtpButton.textContent =
                        "Verify OTP";

                }

            );

        }

        catch (error) {

            console.error(
                "MSG91 verifyOtp exception:",
                error
            );


            otpMessage.textContent =
                "OTP verification failed.";


            verifyOtpButton.disabled =
                false;

            verifyOtpButton.textContent =
                "Verify OTP";

        }

    }
);


/* =====================================================
   GET ACCESS TOKEN
===================================================== */

function getAccessToken(data) {

    if (
        !data
    ) {

        return "";
    }


    /*
       If SDK returns string.
    */

    if (
        typeof data === "string"
    ) {

        return data;
    }


    /*
       Direct accessToken.
    */

    if (
        data.accessToken
    ) {

        return data.accessToken;
    }


    /*
       access_token.
    */

    if (
        data.access_token
    ) {

        return data.access_token;
    }


    /*
       token.
    */

    if (
        data.token
    ) {

        return data.token;
    }


    /*
       Nested data.
    */

    if (
        data.data
        &&
        data.data.accessToken
    ) {

        return data.data.accessToken;
    }


    if (
        data.data
        &&
        data.data.access_token
    ) {

        return data.data.access_token;
    }


    if (
        data.data
        &&
        data.data.token
    ) {

        return data.data.token;
    }


    return "";
}


/* =====================================================
   CONFIRM ORDER WITH JAVA
===================================================== */

function confirmOrderWithJava(
    orderId,
    accessToken
) {

    console.log(
        "Confirming order with Java."
    );


    fetch(
        BACKEND_URL + "/confirm-order",
        {

            method:
                "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify({

                    orderId:
                        orderId,

                    accessToken:
                        accessToken

                })

        }
    )


    .then(
        function(response) {

            if (
                !response.ok
            ) {

                throw new Error(
                    "Java backend returned HTTP "
                    +
                    response.status
                );
            }


            return response.json();

        }
    )


    .then(
        function(data) {

            console.log(
                "Java confirmation:",
                data
            );


            if (
                data.success
            ) {

                /*
                   Hide OTP.
                */

                otpSection.style.display =
                    "none";


                /*
                   Hide form.
                */

                orderForm.style.display =
                    "none";


                /*
                   Show success.
                */

                successSection.style.display =
                    "block";


                successMessage.textContent =
                    "Your order has been successfully confirmed. "
                    +
                    "Order ID: "
                    +
                    data.orderId;

            }

            else {

                otpMessage.textContent =
                    data.message ||
                    "Order confirmation failed.";


                verifyOtpButton.disabled =
                    false;

                verifyOtpButton.textContent =
                    "Verify OTP";

            }

        }
    )


    .catch(
        function(error) {

            console.error(
                "Confirmation error:",
                error
            );


            otpMessage.textContent =
                "Java backend confirmation failed.";


            verifyOtpButton.disabled =
                false;

            verifyOtpButton.textContent =
                "Verify OTP";

        }
    );

}
