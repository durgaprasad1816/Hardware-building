let productRowCount = 0;

function addProductRow() {

    productRowCount++;

    const tableBody =
        document.getElementById("productTableBody");

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>
            <select
                class="product-select"
                onchange="loadProductDetails(this)">

                <option value="">
                    Select Product
                </option>

                <option
                    value="1"
                    data-price="850"
                    data-stock="20">
                    Asian Paints Royale
                </option>

                <option
                    value="2"
                    data-price="750"
                    data-stock="15">
                    Berger Easy Clean
                </option>

                <option
                    value="3"
                    data-price="900"
                    data-stock="10">
                    Nerolac Excel
                </option>

                <option
                    value="4"
                    data-price="950"
                    data-stock="25">
                    Asian Paints Apex
                </option>

                <option
                    value="5"
                    data-price="600"
                    data-stock="12">
                    Wood Paint Gloss
                </option>

            </select>
        </td>


        <td>

            <div class="quantity-control">

                <button
                    type="button"
                    onclick="changeQuantity(this, -1)">
                    −
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                    class="quantity-input"
                    onchange="calculateRowTotal(this)">

                <button
                    type="button"
                    onclick="changeQuantity(this, 1)">
                    +
                </button>

            </div>

        </td>


        <td>

            <input
                type="number"
                class="available-input"
                value="0"
                readonly>

        </td>


        <td>

            <input
                type="number"
                class="unit-price-input"
                value="0"
                readonly>

        </td>


        <td>

            <input
                type="number"
                class="discount-input"
                value="0"
                min="0"
                step="0.01"
                onchange="calculateRowTotal(this)">

        </td>


        <td>

            <span class="row-total">
                ₹0.00
            </span>

        </td>


        <td>

            <button
                type="button"
                class="remove-btn"
                onclick="removeProductRow(this)">

                ✕

            </button>

        </td>
    `;

    tableBody.appendChild(row);
}


function loadProductDetails(select) {

    const row = select.closest("tr");

    const selectedOption =
        select.options[select.selectedIndex];

    if (!selectedOption.value) {

        row.querySelector(".available-input").value = 0;

        row.querySelector(".unit-price-input").value = 0;

        row.querySelector(".row-total").textContent =
            "₹0.00";

        calculateSubtotal();

        return;
    }

    const price =
        parseFloat(selectedOption.dataset.price);

    const stock =
        parseInt(selectedOption.dataset.stock);

    row.querySelector(".unit-price-input").value =
        price;

    row.querySelector(".available-input").value =
        stock;

    calculateRowTotal(select);
}


function changeQuantity(button, change) {

    const row =
        button.closest("tr");

    const quantityInput =
        row.querySelector(".quantity-input");

    const availableInput =
        row.querySelector(".available-input");

    let quantity =
        parseInt(quantityInput.value) || 1;

    const available =
        parseInt(availableInput.value) || 0;

    quantity += change;

    if (quantity < 1) {
        quantity = 1;
    }

    if (available > 0 && quantity > available) {

        quantity = available;

        alert(
            "Quantity cannot be greater than available stock."
        );
    }

    quantityInput.value = quantity;

    calculateRowTotal(quantityInput);
}


function calculateRowTotal(element) {

    const row =
        element.closest("tr");

    const quantity =
        parseFloat(
            row.querySelector(".quantity-input").value
        ) || 0;

    const unitPrice =
        parseFloat(
            row.querySelector(".unit-price-input").value
        ) || 0;

    const discount =
        parseFloat(
            row.querySelector(".discount-input").value
        ) || 0;

    let total =
        (quantity * unitPrice) - discount;

    if (total < 0) {
        total = 0;
    }

    row.querySelector(".row-total").textContent =
        "₹" + total.toFixed(2);

    calculateSubtotal();
}


function removeProductRow(button) {

    const row =
        button.closest("tr");

    row.remove();

    calculateSubtotal();
}


function calculateSubtotal() {

    const rows =
        document.querySelectorAll(
            "#productTableBody tr"
        );

    let subtotal = 0;

    rows.forEach(function(row) {

        const quantity =
            parseFloat(
                row.querySelector(".quantity-input").value
            ) || 0;

        const unitPrice =
            parseFloat(
                row.querySelector(".unit-price-input").value
            ) || 0;

        const discount =
            parseFloat(
                row.querySelector(".discount-input").value
            ) || 0;

        let total =
            (quantity * unitPrice) - discount;

        if (total < 0) {
            total = 0;
        }

        subtotal += total;
    });

    document.getElementById("subtotal").textContent =
        "₹" + subtotal.toFixed(2);

    calculateGrandTotal();
}


function calculateGrandTotal() {

    const subtotalText =
        document.getElementById("subtotal").textContent;

    const subtotal =
        parseFloat(
            subtotalText.replace("₹", "")
        ) || 0;

    const tax =
        parseFloat(
            document.getElementById("tax").value
        ) || 0;

    const grandTotal =
        subtotal + tax;

    document.getElementById("grandTotal").textContent =
        "₹" + grandTotal.toFixed(2);
}


document
    .getElementById("tax")
    .addEventListener(
        "input",
        calculateGrandTotal
    );


async function completeSale() {

    const customer =
        document.getElementById("customer").value;

    const rows =
        document.querySelectorAll(
            "#productTableBody tr"
        );

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const paymentStatus =
        document.getElementById("paymentStatus").value;


    if (!customer) {
        alert("Please select a customer.");
        return;
    }


    if (rows.length === 0) {
        alert("Please add at least one product.");
        return;
    }


    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }


    if (!paymentStatus) {
        alert("Please select a payment status.");
        return;
    }


    const saleData = {

        customerId: parseInt(customer),

        tax: parseFloat(
            document.getElementById("tax").value
        ) || 0,

        paymentMethod: paymentMethod,

        paymentStatus: paymentStatus,

        items: []

    };


    rows.forEach(function(row) {

        const product =
            row.querySelector(".product-select");

        const quantity =
            parseInt(
                row.querySelector(".quantity-input").value
            ) || 0;

        const available =
            parseInt(
                row.querySelector(".available-input").value
            ) || 0;

        const unitPrice =
            parseFloat(
                row.querySelector(".unit-price-input").value
            ) || 0;

        const discount =
            parseFloat(
                row.querySelector(".discount-input").value
            ) || 0;

        const rowTotal =
            (quantity * unitPrice) - discount;


        if (product.value) {

            saleData.items.push({

                productId: parseInt(product.value),

                quantity: quantity,

                available: available,

                unitPrice: unitPrice,

                discount: discount,

                total: Math.max(rowTotal, 0)

            });

        }

    });


    if (saleData.items.length === 0) {

        alert("Please select at least one product.");

        return;
    }


    const subtotalText =
        document.getElementById("subtotal").textContent;

    const subtotal =
        parseFloat(
            subtotalText.replace("₹", "")
        ) || 0;


    const grandTotalText =
        document.getElementById("grandTotal").textContent;

    const grandTotal =
        parseFloat(
            grandTotalText.replace("₹", "")
        ) || 0;


    saleData.subtotal = subtotal;

    saleData.grandTotal = grandTotal;


    try {

        const response =
            await fetch(
                "http://localhost:8081/sales",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(saleData)
                }
            );


        const result =
            await response.text();


        if (response.ok) {

            alert(result);

        } else {

            alert(
                "Sale failed: " + result
            );

        }


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to Java server."
        );
    }
}


function generateInvoice() {

    const customer =
        document.getElementById("customer").value;

    const rows =
        document.querySelectorAll(
            "#productTableBody tr"
        );

    if (!customer) {
        alert("Please select a customer.");
        return;
    }

    if (rows.length === 0) {
        alert("Please add at least one product.");
        return;
    }

    const customerSelect =
        document.getElementById("customer");

    const customerName =
        customerSelect.options[
            customerSelect.selectedIndex
        ].text;

    let invoiceItems = [];

    rows.forEach(function(row) {

        const product =
            row.querySelector(".product-select");

        if (!product.value) {
            return;
        }

        const productName =
            product.options[
                product.selectedIndex
            ].text;

        const quantity =
            parseInt(
                row.querySelector(".quantity-input").value
            ) || 0;

        const unitPrice =
            parseFloat(
                row.querySelector(".unit-price-input").value
            ) || 0;

        const discount =
            parseFloat(
                row.querySelector(".discount-input").value
            ) || 0;

        const total =
            Math.max(
                (quantity * unitPrice) - discount,
                0
            );

        invoiceItems.push({
            productName: productName,
            quantity: quantity,
            unitPrice: unitPrice,
            discount: discount,
            total: total
        });
    });


    if (invoiceItems.length === 0) {
        alert("Please select at least one product.");
        return;
    }


    const subtotal =
        parseFloat(
            document
                .getElementById("subtotal")
                .textContent
                .replace("₹", "")
        ) || 0;


    const tax =
        parseFloat(
            document.getElementById("tax").value
        ) || 0;


    const grandTotal =
        parseFloat(
            document
                .getElementById("grandTotal")
                .textContent
                .replace("₹", "")
        ) || 0;


    let invoiceWindow =
        window.open("", "_blank");


    invoiceWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>Sales Invoice</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #222;
                }

                .invoice {
                    max-width: 900px;
                    margin: auto;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .customer {
                    margin-bottom: 25px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th,
                td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background: #f2f2f2;
                }

                .summary {
                    width: 300px;
                    margin-left: auto;
                    margin-top: 25px;
                }

                .summary div {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                }

                .grand-total {
                    font-size: 20px;
                    font-weight: bold;
                    border-top: 2px solid #222;
                }

                .print-btn {
                    margin-top: 30px;
                    padding: 12px 20px;
                    border: none;
                    background: #222;
                    color: white;
                    cursor: pointer;
                }

                @media print {

                    .print-btn {
                        display: none;
                    }

                }

            </style>

        </head>


        <body>

            <div class="invoice">

                <h1>SALES INVOICE</h1>

                <div class="customer">

                    <strong>Customer:</strong>
                    ${customerName}

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Discount</th>
                            <th>Total</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${invoiceItems.map(function(item) {

                            return `

                                <tr>

                                    <td>
                                        ${item.productName}
                                    </td>

                                    <td>
                                        ${item.quantity}
                                    </td>

                                    <td>
                                        ₹${item.unitPrice.toFixed(2)}
                                    </td>

                                    <td>
                                        ₹${item.discount.toFixed(2)}
                                    </td>

                                    <td>
                                        ₹${item.total.toFixed(2)}
                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>


                <div class="summary">

                    <div>

                        <span>Subtotal</span>

                        <span>
                            ₹${subtotal.toFixed(2)}
                        </span>

                    </div>


                    <div>

                        <span>Tax</span>

                        <span>
                            ₹${tax.toFixed(2)}
                        </span>

                    </div>


                    <div class="grand-total">

                        <span>Grand Total</span>

                        <span>
                            ₹${grandTotal.toFixed(2)}
                        </span>

                    </div>

                </div>


                <button
                    class="print-btn"
                    onclick="window.print()">

                    Print Invoice

                </button>

            </div>

        </body>

        </html>

    `);


    invoiceWindow.document.close();
}