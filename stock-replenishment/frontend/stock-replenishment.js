/* =========================================================
   BUILDMART STOCK REPLENISHMENT
   COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   SERVER
   ========================================================= */

const SERVER_URL = "http://localhost:8085";


/* =========================================================
   PRODUCT COUNTER
   ========================================================= */

let productCount = 0;


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    generateRequestId();

    setRequestDate();

    setMinimumDates();

    addProduct();

    calculateAmount();

    addSummaryListeners();

});


/* =========================================================
   GENERATE REQUEST ID
   ========================================================= */

function generateRequestId() {

    const year = new Date().getFullYear();

    const randomNumber =
        Math.floor(1000 + Math.random() * 9000);

    document.getElementById("requestId").textContent =
        "REQ-" + year + "-" + randomNumber;

}


/* =========================================================
   REQUEST DATE
   ========================================================= */

function setRequestDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    const formattedDate =
        year + "-" + month + "-" + day;

    document.getElementById("requestDate").value =
        formattedDate;

}


/* =========================================================
   MINIMUM DATES
   ========================================================= */

function setMinimumDates() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    const today =
        year + "-" + month + "-" + day;


    document.getElementById("requiredByDate").min =
        today;

    document.getElementById("deliveryDate").min =
        today;

}


/* =========================================================
   ADD PRODUCT
   ========================================================= */

function addProduct() {

    productCount++;


    const productCard =
        document.createElement("div");


    /*
       THIS CLASS IS IMPORTANT.

       The same CSS automatically applies to
       Product 1, 2, 3, 4, 5...
    */

    productCard.className =
        "product-card";


    productCard.innerHTML = `

        <div class="product-card-header">

            <div>

                <span class="product-label">
                    PRODUCT
                </span>

                <span class="product-number">
                    Product ${productCount}
                </span>

            </div>


            <button
                type="button"
                class="remove-product-btn">

                Remove

            </button>

        </div>


        <div class="form-grid">


            <!-- PRODUCT ID -->

            <div class="form-group">

                <label>
                    Product ID
                </label>

                <input
                    type="text"
                    class="productId"
                    placeholder="Product ID">

            </div>


            <!-- PRODUCT NAME -->

            <div class="form-group">

                <label>
                    Product Name <span>*</span>
                </label>

                <input
                    type="text"
                    class="productName"
                    placeholder="Product name"
                    required>

            </div>


            <!-- CATEGORY -->

            <div class="form-group">

                <label>
                    Category <span>*</span>
                </label>

                <select
                    class="category"
                    required>

                    <option value="">
                        Select Category
                    </option>

                    <option value="Cement">
                        Cement
                    </option>

                    <option value="Bricks">
                        Bricks
                    </option>

                    <option value="Steel">
                        Steel
                    </option>

                    <option value="Sand">
                        Sand
                    </option>

                    <option value="Electrical">
                        Electrical
                    </option>

                    <option value="Plumbing">
                        Plumbing
                    </option>

                    <option value="Paint">
                        Paint
                    </option>

                    <option value="Tools">
                        Tools
                    </option>

                    <option value="Hardware">
                        Hardware
                    </option>

                    <option value="Other">
                        Other
                    </option>

                </select>

            </div>


            <!-- CURRENT STOCK -->

            <div class="form-group">

                <label>
                    Current Stock
                </label>

                <input
                    type="number"
                    class="currentStock"
                    value="0"
                    min="0"
                    placeholder="0">

            </div>


            <!-- MINIMUM STOCK -->

            <div class="form-group">

                <label>
                    Minimum Stock Level <span>*</span>
                </label>

                <input
                    type="number"
                    class="minimumStockLevel"
                    value="0"
                    min="0"
                    placeholder="0"
                    required>

            </div>


            <!-- REQUESTED QUANTITY -->

            <div class="form-group">

                <label>
                    Requested Quantity <span>*</span>
                </label>

                <input
                    type="number"
                    class="requestedQuantity"
                    value="0"
                    min="1"
                    placeholder="0"
                    required>

            </div>


            <!-- UNIT -->

            <div class="form-group">

                <label>
                    Unit <span>*</span>
                </label>

                <select
                    class="unit"
                    required>

                    <option value="">
                        Select Unit
                    </option>

                    <option value="Pieces">
                        Pieces
                    </option>

                    <option value="Boxes">
                        Boxes
                    </option>

                    <option value="Bags">
                        Bags
                    </option>

                    <option value="Kg">
                        Kg
                    </option>

                    <option value="Tonnes">
                        Tonnes
                    </option>

                    <option value="Litres">
                        Litres
                    </option>

                    <option value="Meters">
                        Meters
                    </option>

                </select>

            </div>


            <!-- LAST PURCHASE PRICE -->

            <div class="form-group">

                <label>
                    Last Purchase Price
                </label>

                <input
                    type="number"
                    class="lastPurchasePrice"
                    value="0"
                    min="0"
                    step="0.01"
                    placeholder="0.00">

            </div>


            <!-- EXPECTED PRICE -->

            <div class="form-group">

                <label>
                    Expected / Quoted Price <span>*</span>
                </label>

                <input
                    type="number"
                    class="expectedQuotedPrice"
                    value="0"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required>

            </div>


            <!-- REASON -->

            <div class="form-group full-width">

                <label>
                    Reason for Refill <span>*</span>
                </label>

                <textarea
                    class="reasonForRefill"
                    placeholder="Example: Stock below minimum level"
                    required></textarea>

            </div>


        </div>

    `;


    /*
       Add the new product to the page.
    */

    document
        .getElementById("productsContainer")
        .appendChild(productCard);


    /*
       REMOVE PRODUCT
    */

    const removeButton =
        productCard.querySelector(
            ".remove-product-btn"
        );


    removeButton.addEventListener(
        "click",
        function () {

            productCard.remove();

            updateProductNumbers();

            calculateAmount();

        }
    );


    /*
       QUANTITY CHANGE
    */

    const quantity =
        productCard.querySelector(
            ".requestedQuantity"
        );


    /*
       PRICE CHANGE
    */

    const price =
        productCard.querySelector(
            ".expectedQuotedPrice"
        );


    quantity.addEventListener(
        "input",
        calculateAmount
    );


    price.addEventListener(
        "input",
        calculateAmount
    );


    calculateAmount();

}


/* =========================================================
   UPDATE PRODUCT NUMBERS
   ========================================================= */

function updateProductNumbers() {

    const cards =
        document.querySelectorAll(
            "#productsContainer .product-card"
        );


    cards.forEach(function (card, index) {

        const number =
            card.querySelector(
                ".product-number"
            );


        number.textContent =
            "Product " + (index + 1);

    });


    productCount =
        cards.length;

}


/* =========================================================
   CALCULATE AMOUNT
   ========================================================= */

function calculateAmount() {

    const cards =
        document.querySelectorAll(
            "#productsContainer .product-card"
        );


    let totalQuantity = 0;

    let estimatedAmount = 0;


    cards.forEach(function (card) {


        const quantity =
            parseFloat(
                card.querySelector(
                    ".requestedQuantity"
                ).value
            ) || 0;


        const price =
            parseFloat(
                card.querySelector(
                    ".expectedQuotedPrice"
                ).value
            ) || 0;


        totalQuantity += quantity;

        estimatedAmount +=
            quantity * price;

    });


    /*
       Discount
    */

    const discount =
        parseFloat(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    /*
       Tax percentage
    */

    const taxPercentage =
        parseFloat(
            document.getElementById(
                "tax"
            ).value
        ) || 0;


    /*
       Delivery charges
    */

    const deliveryCharges =
        parseFloat(
            document.getElementById(
                "deliveryCharges"
            ).value
        ) || 0;


    /*
       Tax amount
    */

    const taxAmount =
        estimatedAmount *
        taxPercentage /
        100;


    /*
       Final amount
    */

    const finalAmount =
        estimatedAmount -
        discount +
        taxAmount +
        deliveryCharges;


    /*
       UPDATE UI
    */

    document.getElementById(
        "totalProducts"
    ).textContent =
        cards.length;


    document.getElementById(
        "totalQuantity"
    ).textContent =
        totalQuantity;


    document.getElementById(
        "estimatedAmount"
    ).textContent =
        "₹" +
        estimatedAmount.toFixed(2);


    document.getElementById(
        "finalAmount"
    ).textContent =
        "₹" +
        Math.max(finalAmount, 0).toFixed(2);

}


/* =========================================================
   SUMMARY INPUT EVENTS
   ========================================================= */

function addSummaryListeners() {

    document.getElementById(
        "discount"
    ).addEventListener(
        "input",
        calculateAmount
    );


    document.getElementById(
        "tax"
    ).addEventListener(
        "input",
        calculateAmount
    );


    document.getElementById(
        "deliveryCharges"
    ).addEventListener(
        "input",
        calculateAmount
    );

}


/* =========================================================
   COLLECT PRODUCTS
   ========================================================= */

function collectProducts() {

    const cards =
        document.querySelectorAll(
            "#productsContainer .product-card"
        );


    const products = [];


    cards.forEach(function (card) {


        const product = {

            productId:
                card.querySelector(
                    ".productId"
                ).value.trim(),


            productName:
                card.querySelector(
                    ".productName"
                ).value.trim(),


            category:
                card.querySelector(
                    ".category"
                ).value,


            currentStock:
                parseFloat(
                    card.querySelector(
                        ".currentStock"
                    ).value
                ) || 0,


            minimumStockLevel:
                parseFloat(
                    card.querySelector(
                        ".minimumStockLevel"
                    ).value
                ) || 0,


            requestedQuantity:
                parseFloat(
                    card.querySelector(
                        ".requestedQuantity"
                    ).value
                ) || 0,


            unit:
                card.querySelector(
                    ".unit"
                ).value,


            lastPurchasePrice:
                parseFloat(
                    card.querySelector(
                        ".lastPurchasePrice"
                    ).value
                ) || 0,


            expectedQuotedPrice:
                parseFloat(
                    card.querySelector(
                        ".expectedQuotedPrice"
                    ).value
                ) || 0,


            reasonForRefill:
                card.querySelector(
                    ".reasonForRefill"
                ).value.trim()

        };


        products.push(product);

    });


    return products;

}


/* =========================================================
   COLLECT REQUEST
   ========================================================= */

function collectRequest(status) {

    const request = {


        requestId:
            document.getElementById(
                "requestId"
            ).textContent.trim(),


        requestDate:
            document.getElementById(
                "requestDate"
            ).value,


        requiredByDate:
            document.getElementById(
                "requiredByDate"
            ).value,


        priority:
            document.getElementById(
                "priority"
            ).value,


        requestStatus:
            status,


        /* SHOP */

        shopName:
            document.getElementById(
                "shopName"
            ).value.trim(),


        shopId:
            document.getElementById(
                "shopId"
            ).value.trim(),


        ownerManager:
            document.getElementById(
                "ownerManager"
            ).value.trim(),


        shopPhone:
            document.getElementById(
                "shopPhone"
            ).value.trim(),


        shopEmail:
            document.getElementById(
                "shopEmail"
            ).value.trim(),


        shopAddress:
            document.getElementById(
                "shopAddress"
            ).value.trim(),


        /* SUPPLIER */

        supplierName:
            document.getElementById(
                "supplierName"
            ).value.trim(),


        supplierId:
            document.getElementById(
                "supplierId"
            ).value.trim(),


        contactPerson:
            document.getElementById(
                "contactPerson"
            ).value.trim(),


        supplierPhone:
            document.getElementById(
                "supplierPhone"
            ).value.trim(),


        supplierEmail:
            document.getElementById(
                "supplierEmail"
            ).value.trim(),


        supplierAddress:
            document.getElementById(
                "supplierAddress"
            ).value.trim(),


        /* PRODUCTS */

        products:
            collectProducts(),


        /* DELIVERY */

        deliveryAddress:
            document.getElementById(
                "deliveryAddress"
            ).value.trim(),


        deliveryDate:
            document.getElementById(
                "deliveryDate"
            ).value,


        deliveryTime:
            document.getElementById(
                "deliveryTime"
            ).value,


        deliveryInstructions:
            document.getElementById(
                "deliveryInstructions"
            ).value.trim(),


        /* ADDITIONAL */

        reasonRequest:
            document.getElementById(
                "reasonRequest"
            ).value.trim(),


        remarks:
            document.getElementById(
                "remarks"
            ).value.trim(),


        /* AMOUNT */

        discount:
            parseFloat(
                document.getElementById(
                    "discount"
                ).value
            ) || 0,


        tax:
            parseFloat(
                document.getElementById(
                    "tax"
                ).value
            ) || 0,


        deliveryCharges:
            parseFloat(
                document.getElementById(
                    "deliveryCharges"
                ).value
            ) || 0

    };


    return request;

}


/* =========================================================
   SAVE REQUEST
   ========================================================= */

async function saveRequest(status) {


    /*
       Basic validation
    */

    if (!validateRequest()) {
        return;
    }


    const request =
        collectRequest(status);


    showMessage(
        "Saving request...",
        "loading"
    );


    try {


        const response =
            await fetch(
                SERVER_URL +
                "/stock-replenishment",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(request)

                }
            );


        const result =
            await response.json();


        if (response.ok) {

            showMessage(
                result.message ||
                "Request saved successfully.",
                "success"
            );

        } else {

            showMessage(
                result.message ||
                "Unable to save request.",
                "error"
            );

        }


    } catch (error) {

        console.error(error);


        showMessage(
            "Server connection failed. Make sure the Java server is running on port 8085.",
            "error"
        );

    }

}


/* =========================================================
   VALIDATE REQUEST
   ========================================================= */

function validateRequest() {


    const requiredByDate =
        document.getElementById(
            "requiredByDate"
        ).value;


    const priority =
        document.getElementById(
            "priority"
        ).value;


    const shopName =
        document.getElementById(
            "shopName"
        ).value.trim();


    const shopId =
        document.getElementById(
            "shopId"
        ).value.trim();


    const ownerManager =
        document.getElementById(
            "ownerManager"
        ).value.trim();


    const shopPhone =
        document.getElementById(
            "shopPhone"
        ).value.trim();


    const shopEmail =
        document.getElementById(
            "shopEmail"
        ).value.trim();


    const shopAddress =
        document.getElementById(
            "shopAddress"
        ).value.trim();


    const supplierName =
        document.getElementById(
            "supplierName"
        ).value.trim();


    const supplierId =
        document.getElementById(
            "supplierId"
        ).value.trim();


    const contactPerson =
        document.getElementById(
            "contactPerson"
        ).value.trim();


    const deliveryAddress =
        document.getElementById(
            "deliveryAddress"
        ).value.trim();


    const products =
        collectProducts();


    if (!requiredByDate) {

        showMessage(
            "Please select Required By Date.",
            "error"
        );

        return false;
    }


    if (!priority) {

        showMessage(
            "Please select Priority.",
            "error"
        );

        return false;
    }


    if (!shopName ||
        !shopId ||
        !ownerManager ||
        !shopPhone ||
        !shopEmail ||
        !shopAddress) {

        showMessage(
            "Please complete all required Shop Details.",
            "error"
        );

        return false;
    }


    if (!supplierName ||
        !supplierId ||
        !contactPerson) {

        showMessage(
            "Please complete the required Supplier Details.",
            "error"
        );

        return false;
    }


    if (!deliveryAddress) {

        showMessage(
            "Please enter Delivery Address.",
            "error"
        );

        return false;
    }


    if (products.length === 0) {

        showMessage(
            "Please add at least one product.",
            "error"
        );

        return false;
    }


    for (
        let i = 0;
        i < products.length;
        i++
    ) {

        const product =
            products[i];


        if (!product.productName) {

            showMessage(
                "Please enter Product Name for Product " +
                (i + 1) +
                ".",
                "error"
            );

            return false;
        }


        if (!product.category) {

            showMessage(
                "Please select Category for Product " +
                (i + 1) +
                ".",
                "error"
            );

            return false;
        }


        if (!product.unit) {

            showMessage(
                "Please select Unit for Product " +
                (i + 1) +
                ".",
                "error"
            );

            return false;
        }


        if (product.requestedQuantity <= 0) {

            showMessage(
                "Requested Quantity must be greater than 0 for Product " +
                (i + 1) +
                ".",
                "error"
            );

            return false;
        }


        if (product.expectedQuotedPrice < 0) {

            showMessage(
                "Expected Price cannot be negative for Product " +
                (i + 1) +
                ".",
                "error"
            );

            return false;
        }

    }


    return true;

}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(message, type) {

    const messageElement =
        document.getElementById(
            "message"
        );


    messageElement.textContent =
        message;


    if (type === "success") {

        messageElement.style.color =
            "#1d7043";

        messageElement.style.background =
            "#edf7f1";

    }

    else if (type === "error") {

        messageElement.style.color =
            "#c0392b";

        messageElement.style.background =
            "#fff3f2";

    }

    else {

        messageElement.style.color =
            "#395777";

        messageElement.style.background =
            "#f2f6f9";

    }

}


/* =========================================================
   CANCEL
   ========================================================= */

function cancelRequest() {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this request?"
        );


    if (confirmCancel) {

        window.close();

    }

}


/* =========================================================
   BACK TO DASHBOARD
   ========================================================= */

function goBack() {

    /*
       If this page was opened from the dashboard
       using window.open(), close this tab.
    */

    if (window.opener) {

        window.close();

    } else {

        window.history.back();

    }

}