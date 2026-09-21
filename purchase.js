// ======================================
// Automatically Set Today's Date
// ======================================

const purchaseDate =
    document.getElementById("purchaseDate");


const today = new Date();


const year =
    today.getFullYear();


const month =
    String(today.getMonth() + 1)
        .padStart(2, "0");


const day =
    String(today.getDate())
        .padStart(2, "0");


purchaseDate.value =
    `${year}-${month}-${day}`;


// ======================================
// Input Elements
// ======================================

const productName =
    document.getElementById("productName");

const cost =
    document.getElementById("cost");

const quantity =
    document.getElementById("quantity");

const stock =
    document.getElementById("stock");

const discount =
    document.getElementById("discount");


// ======================================
// Automatic Calculation
// ======================================

function calculateProduct() {

    let productCost =
        Number(cost.value) || 0;


    let productQuantity =
        Number(quantity.value) || 0;


    let discountPercent =
        Number(discount.value) || 0;


    let gross =
        productCost *
        productQuantity;


    let discountValue =
        gross *
        discountPercent /
        100;


    let total =
        gross -
        discountValue;


    document.getElementById(
        "grossAmount"
    ).innerText =
        "₹" + gross.toFixed(2);


    document.getElementById(
        "discountAmount"
    ).innerText =
        "₹" + discountValue.toFixed(2);


    document.getElementById(
        "totalAmount"
    ).innerText =
        "₹" + total.toFixed(2);
}


// Calculate automatically

cost.addEventListener(
    "input",
    calculateProduct
);


quantity.addEventListener(
    "input",
    calculateProduct
);


discount.addEventListener(
    "input",
    calculateProduct
);


// ======================================
// Product Array
// ======================================

let products = [];


// ======================================
// Add Product
// ======================================

function addProduct() {

    let name =
        productName.value.trim();


    let productCost =
        Number(cost.value);


    let productQuantity =
        Number(quantity.value);


    let productStock =
        Number(stock.value);


    let discountPercent =
        Number(discount.value) || 0;


    // Validation

    if (name === "") {

        alert(
            "Please enter product name"
        );

        return;
    }


    if (
        !productCost ||
        productCost <= 0
    ) {

        alert(
            "Please enter product cost"
        );

        return;
    }


    if (
        !productQuantity ||
        productQuantity <= 0
    ) {

        alert(
            "Please enter quantity"
        );

        return;
    }


    // Calculations

    let gross =
        productCost *
        productQuantity;


    let discountValue =
        gross *
        discountPercent /
        100;


    let total =
        gross -
        discountValue;


    // Create object

    let product = {

        date:
            purchaseDate.value,

        name:
            name,

        cost:
            productCost,

        quantity:
            productQuantity,

        stock:
            productStock || 0,

        discountPercent:
            discountPercent,

        discountAmount:
            discountValue,

        total:
            total
    };


    // Add product

    products.push(product);


    // Display

    displayProducts();


    // Clear

    productName.value = "";

    cost.value = "";

    quantity.value = "";

    stock.value = "";

    discount.value = "";


    calculateProduct();
}


// ======================================
// Display Products
// ======================================

function displayProducts() {

    const tableBody =
        document.getElementById(
            "productTableBody"
        );


    tableBody.innerHTML = "";


    products.forEach(
        (product, index) => {

            let row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${product.date}
                </td>

                <td>
                    ${product.name}
                </td>

                <td>
                    ₹${product.cost.toFixed(2)}
                </td>

                <td>
                    ${product.quantity}
                </td>

                <td>
                    ${product.stock}
                </td>

                <td>
                    ${product.discountPercent}%
                </td>

                <td>
                    ₹${product.discountAmount.toFixed(2)}
                </td>

                <td>
                    ₹${product.total.toFixed(2)}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="
                            deleteProduct(${index})
                        ">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );


    updateSummary();
}


// ======================================
// Delete Product
// ======================================

function deleteProduct(index) {

    products.splice(
        index,
        1
    );


    displayProducts();
}


// ======================================
// Summary
// ======================================

function updateSummary() {

    let totalProducts =
        products.length;


    let totalQuantity =
        products.reduce(
            (sum, product) =>
                sum + product.quantity,
            0
        );


    let overallDiscount =
        products.reduce(
            (sum, product) =>
                sum +
                product.discountAmount,
            0
        );


    let grandTotal =
        products.reduce(
            (sum, product) =>
                sum +
                product.total,
            0
        );


    document.getElementById(
        "totalProducts"
    ).innerText =
        totalProducts;


    document.getElementById(
        "totalQuantity"
    ).innerText =
        totalQuantity;


    document.getElementById(
        "overallDiscount"
    ).innerText =
        "₹" +
        overallDiscount.toFixed(2);


    document.getElementById(
        "grandTotal"
    ).innerText =
        "₹" +
        grandTotal.toFixed(2);
}


// ======================================
// Image Preview
// ======================================

const productImages =
    document.getElementById(
        "productImages"
    );


const preview =
    document.getElementById(
        "preview"
    );


productImages.addEventListener(
    "change",
    function () {

        preview.innerHTML = "";


        Array.from(this.files)
            .forEach(file => {

                const reader =
                    new FileReader();


                reader.onload =
                    function(event) {

                        const img =
                            document.createElement(
                                "img"
                            );


                        img.src =
                            event.target.result;


                        img.className =
                            "preview-image";


                        preview.appendChild(
                            img
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            });
    }
);


// ======================================
// SAVE PURCHASE TO JAVA BACKEND
// ======================================

async function savePurchase() {

    if (products.length === 0) {

        alert(
            "Please add at least one product"
        );

        return;
    }


    const supplierName =
        document.getElementById(
            "supplierName"
        ).value.trim();


    if (supplierName === "") {

        alert(
            "Please enter supplier name"
        );

        return;
    }


    // ==================================
    // Create Product String
    // ==================================

    let productString =
        products.map(product => {

            return (

                product.name + "|" +

                product.cost + "|" +

                product.quantity + "|" +

                product.stock + "|" +

                product.discountPercent + "|" +

                product.discountAmount + "|" +

                product.total

            );

        }).join("##");


    // ==================================
    // Summary
    // ==================================

    let totalProducts =
        products.length;


    let totalQuantity =
        products.reduce(
            (sum, product) =>
                sum + product.quantity,
            0
        );


    let overallDiscount =
        products.reduce(
            (sum, product) =>
                sum +
                product.discountAmount,
            0
        );


    let grandTotal =
        products.reduce(
            (sum, product) =>
                sum +
                product.total,
            0
        );


    // ==================================
    // Send to Java
    // ==================================

    const data = new URLSearchParams();


    data.append(
        "purchaseDate",
        purchaseDate.value
    );


    data.append(
        "supplierName",
        supplierName
    );


    data.append(
        "totalProducts",
        totalProducts
    );


    data.append(
        "totalQuantity",
        totalQuantity
    );


    data.append(
        "overallDiscount",
        overallDiscount
    );


    data.append(
        "grandTotal",
        grandTotal
    );


    data.append(
        "products",
        productString
    );


    try {

        const response =
            await fetch(
                "http://localhost:8055/purchase",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded"

                    },

                    body:
                        data.toString()
                }
            );


        const result =
            await response.text();


        console.log(
            "Java Response:",
            result
        );


        document.getElementById(
            "message"
        ).innerText =
            result;


        alert(result);


        // Clear after successful save

        products = [];

        displayProducts();

    }
    catch (error) {

        console.error(error);


        document.getElementById(
            "message"
        ).innerText =
            "Backend connection failed";


        alert(
            "Java backend is not running"
        );
    }
}