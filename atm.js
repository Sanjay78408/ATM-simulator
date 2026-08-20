/* ==========================================
   NOVABANK ATM APPLICATION
========================================== */


/* ================= ACCOUNT DATA ================= */

let account = {

    accountNumber: "123456789012",

    name: "Sanjay Vignesh",

    pin: "1234",

    balance: 10000,

    accountType: "Savings"

};


/* ================= SYSTEM DATA ================= */

let transactions = [];

let wrongAttempts = 0;

let locked = false;

let currentTransaction = "";


/* ================= LOGIN ================= */

function login() {

    if (locked) {

        document.getElementById("loginMessage").textContent =
            "Account temporarily locked.";

        return;
    }


    let accountNumber =
        document.getElementById("accountNumber").value.trim();

    let pin =
        document.getElementById("loginPin").value.trim();


    if (
        accountNumber === account.accountNumber &&
        pin === account.pin
    ) {

        wrongAttempts = 0;

        document
            .getElementById("loginPage")
            .classList.add("hidden");

        document
            .getElementById("dashboardPage")
            .classList.remove("hidden");


        document.getElementById("welcomeUser").textContent =
            "Hi, " + account.name;


        document.getElementById("displayName").textContent =
            account.name;


        document.getElementById("displayAccount").textContent =
            formatAccount(account.accountNumber);


        updateBalance();

    }

    else {

        wrongAttempts++;

        let remaining = 3 - wrongAttempts;


        if (remaining <= 0) {

            locked = true;

            document.getElementById("loginMessage").textContent =
                "Too many incorrect attempts. Account locked.";

        }

        else {

            document.getElementById("loginMessage").textContent =
                "Incorrect account number or PIN. " +
                remaining +
                " attempts remaining.";

        }

    }

}


/* ================= FORMAT ACCOUNT ================= */

function formatAccount(number) {

    return number.replace(
        /(\d{4})(?=\d)/g,
        "$1 "
    );

}


/* ================= UPDATE BALANCE ================= */

function updateBalance() {

    document.getElementById("balance").textContent =
        "₹" + account.balance.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2
            }
        );

}


/* ================= TOGGLE PIN ================= */

function togglePin() {

    let input =
        document.getElementById("loginPin");

    if (input.type === "password") {

        input.type = "text";

    }

    else {

        input.type = "password";

    }

}


/* ================= BALANCE ================= */

function showBalance() {

    showOutput(
        "Balance Enquiry",

        `
        <div class="balance-result">

            <p>Available Balance</p>

            <h1>
                ₹${account.balance.toLocaleString("en-IN")}
            </h1>

            <p class="deposit-text">
                <i class="fa-solid fa-circle-check"></i>
                Balance available for withdrawal
            </p>

        </div>
        `
    );

}


/* ================= TRANSACTION ================= */

function openTransaction(type) {

    currentTransaction = type;


    let title =
        type === "deposit"
            ? "Deposit Money"
            : "Withdraw Cash";


    openModal(`

        <h2>${title}</h2>

        <p style="color:#64748b;margin-bottom:20px">
            Enter the amount you want to ${
                type === "deposit"
                ? "deposit"
                : "withdraw"
            }.
        </p>

        <input
            type="number"
            id="transactionAmount"
            class="modal-input"
            placeholder="Enter amount"
            min="1"
        >

        ${
            type === "withdraw"

            ? `
            <div style="margin-bottom:15px">

                <button
                    onclick="setAmount(500)"
                    style="padding:8px;margin:3px;background:#f1f5f9;border-radius:8px"
                >
                    ₹500
                </button>

                <button
                    onclick="setAmount(1000)"
                    style="padding:8px;margin:3px;background:#f1f5f9;border-radius:8px"
                >
                    ₹1,000
                </button>

                <button
                    onclick="setAmount(2000)"
                    style="padding:8px;margin:3px;background:#f1f5f9;border-radius:8px"
                >
                    ₹2,000
                </button>

                <button
                    onclick="setAmount(5000)"
                    style="padding:8px;margin:3px;background:#f1f5f9;border-radius:8px"
                >
                    ₹5,000
                </button>

            </div>
            `
            : ""
        }

        <button
            class="modal-btn"
            onclick="processTransaction()"
        >
            Confirm
        </button>

    `);

}


/* ================= QUICK AMOUNT ================= */

function setAmount(amount) {

    document.getElementById(
        "transactionAmount"
    ).value = amount;

}


/* ================= PROCESS TRANSACTION ================= */

function processTransaction() {

    let amount =
        Number(
            document.getElementById(
                "transactionAmount"
            ).value
        );


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;

    }


    /* DEPOSIT */

    if (currentTransaction === "deposit") {

        account.balance += amount;


        transactions.unshift({

            type: "deposit",

            amount: amount,

            date: new Date().toLocaleString()

        });


        updateBalance();

        closeModal();

        showSuccess(
            "Deposit Successful",
            `₹${amount.toLocaleString("en-IN")} has been deposited into your account.`
        );

    }


    /* WITHDRAW */

    else {

        if (amount > account.balance) {

            alert("Insufficient balance.");

            return;

        }


        account.balance -= amount;


        transactions.unshift({

            type: "withdraw",

            amount: amount,

            date: new Date().toLocaleString()

        });


        updateBalance();

        closeModal();

        showSuccess(
            "Withdrawal Successful",
            `Please collect ₹${amount.toLocaleString("en-IN")} from the cash dispenser.`
        );

    }

}


/* ================= TRANSACTIONS ================= */

function showTransactions() {

    if (transactions.length === 0) {

        showOutput(
            "Transaction History",

            `
            <div style="text-align:center;padding:30px">

                <i
                    class="fa-solid fa-receipt"
                    style="font-size:40px;color:#94a3b8"
                ></i>

                <p style="margin-top:15px">
                    No transactions yet.
                </p>

            </div>
            `
        );

        return;

    }


    let html = "";


    transactions.forEach(transaction => {

        let isDeposit =
            transaction.type === "deposit";


        html += `

        <div class="transaction">

            <div>

                <strong>
                    ${
                        isDeposit
                        ? "Money Deposited"
                        : "Cash Withdrawal"
                    }
                </strong>

                <small>
                    ${transaction.date}
                </small>

            </div>

            <strong
                class="${
                    isDeposit
                    ? "deposit-text"
                    : "withdraw-text"
                }"
            >
                ${
                    isDeposit
                    ? "+"
                    : "-"
                }
                ₹${transaction.amount.toLocaleString("en-IN")}
            </strong>

        </div>

        `;

    });


    showOutput(
        "Transaction History",
        html
    );

}


/* ================= MINI STATEMENT ================= */

function showMiniStatement() {

    let recent =
        transactions.slice(0, 5);


    let html = `

        <div style="margin-bottom:20px">

            <strong>
                Recent Transactions
            </strong>

            <p style="color:#64748b">
                Last 5 transactions
            </p>

        </div>

    `;


    if (recent.length === 0) {

        html += `
            <p>No transactions available.</p>
        `;

    }


    recent.forEach(t => {

        html += `

            <div class="transaction">

                <div>

                    <strong>
                        ${
                            t.type === "deposit"
                            ? "Deposit"
                            : "Withdrawal"
                        }
                    </strong>

                    <small>
                        ${t.date}
                    </small>

                </div>

                <strong
                    class="${
                        t.type === "deposit"
                        ? "deposit-text"
                        : "withdraw-text"
                    }"
                >
                    ${
                        t.type === "deposit"
                        ? "+"
                        : "-"
                    }
                    ₹${t.amount.toLocaleString("en-IN")}

                </strong>

            </div>

        `;

    });


    showOutput(
        "Mini Statement",
        html
    );

}


/* ================= CHANGE PIN ================= */

function openChangePin() {

    openModal(`

        <h2>
            <i
                class="fa-solid fa-key"
                style="color:#db2777"
            ></i>

            Change ATM PIN
        </h2>


        <p style="color:#64748b;margin-bottom:20px">
            Verify your account before creating a new PIN.
        </p>


        <input
            type="text"
            id="changeAccount"
            class="modal-input"
            placeholder="Account Number"
            maxlength="12"
        >


        <input
            type="password"
            id="currentPin"
            class="modal-input"
            placeholder="Current PIN"
            maxlength="4"
        >


        <input
            type="password"
            id="newPin"
            class="modal-input"
            placeholder="New 4-Digit PIN"
            maxlength="4"
        >


        <input
            type="password"
            id="confirmPin"
            class="modal-input"
            placeholder="Confirm New PIN"
            maxlength="4"
        >


        <button
            class="modal-btn"
            onclick="changePin()"
        >
            Change PIN
        </button>

    `);

}


/* ================= CHANGE PIN PROCESS ================= */

function changePin() {

    let accountNumber =
        document.getElementById(
            "changeAccount"
        ).value.trim();


    let currentPin =
        document.getElementById(
            "currentPin"
        ).value.trim();


    let newPin =
        document.getElementById(
            "newPin"
        ).value.trim();


    let confirmPin =
        document.getElementById(
            "confirmPin"
        ).value.trim();


    if (
        accountNumber !== account.accountNumber
    ) {

        alert("Incorrect account number.");

        return;

    }


    if (currentPin !== account.pin) {

        alert("Current PIN is incorrect.");

        return;

    }


    if (!/^\d{4}$/.test(newPin)) {

        alert("New PIN must contain exactly 4 digits.");

        return;

    }


    if (newPin === currentPin) {

        alert(
            "New PIN must be different from current PIN."
        );

        return;

    }


    if (newPin !== confirmPin) {

        alert("New PIN and confirmation PIN do not match.");

        return;

    }


    account.pin = newPin;


    closeModal();


    showSuccess(
        "PIN Changed Successfully",
        "Your ATM PIN has been updated successfully."
    );

}


/* ================= ACCOUNT DETAILS ================= */

function showAccountDetails() {

    showOutput(
        "Account Details",

        `

        <div>

            <div class="transaction">

                <strong>Account Holder</strong>

                <span>
                    ${account.name}
                </span>

            </div>


            <div class="transaction">

                <strong>Account Number</strong>

                <span>
                    ${formatAccount(account.accountNumber)}
                </span>

            </div>


            <div class="transaction">

                <strong>Account Type</strong>

                <span>
                    ${account.accountType}
                </span>

            </div>


            <div class="transaction">

                <strong>Available Balance</strong>

                <strong class="deposit-text">
                    ₹${account.balance.toLocaleString("en-IN")}
                </strong>

            </div>

        </div>

        `
    );

}


/* ================= QUICK CASH ================= */

function showQuickWithdraw() {

    openModal(`

        <h2>
            <i
                class="fa-solid fa-bolt"
                style="color:#f59e0b"
            ></i>

            Quick Cash
        </h2>

        <p style="color:#64748b">
            Select an amount
        </p>


        <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-top:20px;
        ">

            <button
                class="modal-btn"
                onclick="quickWithdraw(500)"
            >
                ₹500
            </button>

            <button
                class="modal-btn"
                onclick="quickWithdraw(1000)"
            >
                ₹1,000
            </button>

            <button
                class="modal-btn"
                onclick="quickWithdraw(2000)"
            >
                ₹2,000
            </button>

            <button
                class="modal-btn"
                onclick="quickWithdraw(5000)"
            >
                ₹5,000
            </button>

        </div>

    `);

}


/* ================= QUICK WITHDRAW PROCESS ================= */

function quickWithdraw(amount) {

    if (amount > account.balance) {

        alert("Insufficient balance.");

        return;

    }


    account.balance -= amount;


    transactions.unshift({

        type: "withdraw",

        amount: amount,

        date: new Date().toLocaleString()

    });


    updateBalance();

    closeModal();


    showSuccess(
        "Quick Cash Successful",
        `Please collect ₹${amount.toLocaleString("en-IN")}.`
    );

}


/* ================= SECURITY ================= */

function showSecurity() {

    showOutput(
        "Security Center",

        `

        <div>

            <div class="transaction">

                <strong>
                    <i
                        class="fa-solid fa-lock"
                    ></i>
                    PIN Security
                </strong>

                <span class="deposit-text">
                    Protected
                </span>

            </div>


            <div class="transaction">

                <strong>
                    Account Status
                </strong>

                <span class="deposit-text">
                    Active
                </span>

            </div>


            <div class="transaction">

                <strong>
                    Failed Login Attempts
                </strong>

                <span>
                    ${wrongAttempts}
                </span>

            </div>


            <div class="transaction">

                <strong>
                    Security Recommendation
                </strong>

                <span>
                    Change PIN regularly
                </span>

            </div>

        </div>

        `
    );

}


/* ================= HELP ================= */

function contactBank() {

    showOutput(
        "Help & Support",

        `

        <div style="text-align:center;padding:20px">

            <i
                class="fa-solid fa-headset"
                style="
                    font-size:45px;
                    color:#2563eb;
                "
            ></i>

            <h3 style="margin:15px">
                Customer Support
            </h3>

            <p>
                24/7 Banking Support
            </p>

            <h2 style="margin-top:15px">
                1800-123-4567
            </h2>

        </div>

        `
    );

}


/* ================= OUTPUT PANEL ================= */

function showOutput(title, content) {

    document
        .getElementById("outputPanel")
        .classList.remove("hidden");


    document
        .getElementById("outputTitle")
        .textContent = title;


    document
        .getElementById("outputContent")
        .innerHTML = content;


    window.scrollTo({

        top:
            document
            .getElementById("outputPanel")
            .offsetTop - 100,

        behavior: "smooth"

    });

}


function closeOutput() {

    document
        .getElementById("outputPanel")
        .classList.add("hidden");

}


/* ================= MODAL ================= */

function openModal(content) {

    document
        .getElementById("modalContent")
        .innerHTML = content;


    document
        .getElementById("modal")
        .classList.remove("hidden");

}


function closeModal() {

    document
        .getElementById("modal")
        .classList.add("hidden");

}


/* ================= SUCCESS MESSAGE ================= */

function showSuccess(title, message) {

    openModal(`

        <div style="text-align:center">

            <div style="
                width:70px;
                height:70px;
                margin:auto;
                border-radius:50%;
                background:#dcfce7;
                color:#16a34a;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:30px;
            ">

                <i class="fa-solid fa-check"></i>

            </div>


            <h2 style="margin-top:20px">
                ${title}
            </h2>


            <p style="
                color:#64748b;
                margin:15px 0 25px
            ">
                ${message}
            </p>


            <button
                class="modal-btn"
                onclick="closeModal()"
            >
                Done
            </button>

        </div>

    `);

}


/* ================= LOGOUT ================= */

function logout() {

    document
        .getElementById("dashboardPage")
        .classList.add("hidden");


    document
        .getElementById("loginPage")
        .classList.remove("hidden");


    document.getElementById("loginPin").value = "";

    document.getElementById("accountNumber").value = "";


    document.getElementById("loginMessage").textContent = "";

}