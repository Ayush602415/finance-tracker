const login  = document.querySelector("#loginForm")
const register = document.querySelector("#registerForm")
const span1 = document.querySelector("#showRegister")
const span2 = document.querySelector("#showLogin")

const username = document.querySelector("#registerUsername")
const password = document.querySelector("#registerPassword")
const confirmPassword = document.querySelector("#confirmPassword")
const registerBtn = document.querySelector("#registerBtn")


const loginusername = document.querySelector("#loginUsername")
const loginpassword = document.querySelector("#loginPassword")
const loginBtn = document.querySelector("#loginBtn")

const dashboard = document.querySelector("#dashboard")
const logout = document.querySelector("#logoutBtn")

const addBtn  = document.querySelector("#openForm")
const model  = document.querySelector("#transactionModal")

const closeBtn = document.querySelector("#closeForm");

const transactionForm = document.querySelector("#transactionForm");

const title = document.querySelector("#title");
const amount = document.querySelector("#amount");
const category = document.querySelector("#category");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const submit  = document.querySelector("#addBtn")

const transactionBody = document.querySelector("#transactionBody");


const currentBalance = document.querySelector("#currentBalance");
const totalIncome = document.querySelector("#totalIncome");
const totalExpense = document.querySelector("#totalExpense");
const totalTransactions = document.querySelector("#totalTransactions");

const search = document.querySelector("#search");
const filterType = document.querySelector("#filterType");

const resetBtn = document.querySelector("#resetBtn");
const darkMode = document.querySelector("#darkMode");

const settings  = document.querySelector(".settings-btn")
const smodel = document.querySelector(".settings-modal")


const settingsBtn = document.querySelector(".settings-btn");
const settingsModal = document.querySelector(".settings-modal");
const closeSettings = document.querySelector("#closeSettings");

const usernameInput = document.querySelector("#username");
const currencySelect = document.querySelector("#currency");
const savebtn = document.querySelector(".save-btn");

const welcomeUser = document.querySelector("#welcomeUser");

span1.addEventListener("click",function(){
    login.style.display = "none"
    register.style.display = "flex"
})
span2.addEventListener("click",function(){
    register.style.display = "none"
    login.style.display = "flex"
})

registerBtn.addEventListener("click",function(e){
    e.preventDefault()
    if(username.value.trim()==="" || confirmPassword.value.trim()==="" || password.value.trim()===""){
        alert("Please Enter details")
        return
    }
    if(password.value!==confirmPassword.value){
        alert("Password Not Matched")
        return
    }
    alert("Password Matched")
    const user = {
        username: username.value,
        password: password.value
    }
    localStorage.setItem("user" , JSON.stringify(user))
    alert("Registration Sucessful")
    register.style.display = "none";
    login.style.display = "flex";
})

loginBtn.addEventListener("click",function(e){
    e.preventDefault()
   const user = JSON.parse(localStorage.getItem("user"))
   if(!user){
    alert("Please Register first")
    return
   }
   if(loginusername.value===user.username && loginpassword.value===user.password){

    alert("Login Successful");

    localStorage.setItem("isLoggedIn","true");

    login.style.display = "none";
    dashboard.style.display = "block";

    let savedName = localStorage.getItem("username");

    if(savedName){
        welcomeUser.textContent = `Hello, ${savedName}`;
    }else{
        welcomeUser.textContent = `Hello, ${user.username}`;
    }

}
else{
    alert("Invalid Username or Password");
}
})


logout.addEventListener("click",function(){
    localStorage.removeItem("isLoggedIn")

    dashboard.style.display = "none"
    login.style.display = "flex"
})

addBtn.addEventListener("click",function(){
    model.style.display = "flex"
})

closeBtn.addEventListener("click", function () {
    model.style.display = "none";
});

settings.addEventListener("click",function(){
    addBtn.style.display = "none"
    smodel.style.display = "flex"
})
closeSettings.addEventListener("click",function(){
    addBtn.style.display = "flex"
    smodel.style.display = "none"
})


savebtn.addEventListener("click", function (e) {
    e.preventDefault()
    let name = usernameInput.value.trim();
    let currency = currencySelect.value;

    if (name === "") {
        alert("Please enter username");
        return;
    }

    localStorage.setItem("username", name);
    localStorage.setItem("currency", currency);

    welcomeUser.textContent = `Hello  ${name}`
    currentBalance.textContent = `${currency}0.00`;
    totalIncome.textContent = `${currency}0.00`;
    totalExpense.textContent = `${currency}0.00`;


    settingsModal.style.display = "none";
    addBtn.style.display = "flex"
    usernameInput.value = "";
});

let savedName = localStorage.getItem("username");
let savedCurrency = localStorage.getItem("currency");

if (savedName) {
    welcomeUser.textContent = `Hello, ${savedName}`;
    usernameInput.value = savedName;
}

if (savedCurrency) {
    currencySelect.value = savedCurrency;
    currentBalance.textContent = `${savedCurrency}0.00`;
    totalIncome.textContent = `${savedCurrency}0.00`;
    totalExpense.textContent = `${savedCurrency}0.00`;
}

let transactions = JSON.parse(localStorage.getItem("transactions"))||[]
transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let transaction = {
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        type: type.value,
        date: date.value
    };
    if(title.value.trim()===""|| amount.value.trim()===""|| category.value.trim()===""|| type.value.trim()===""|| date.value.trim()===""){
        return
    }
    if (editIndex === -1) {

     transactions.push(transaction);

    } else {

        
        transactions[editIndex] = transaction;

        editIndex = -1;

    }

    localStorage.setItem("transactions", JSON.stringify(transactions));

    showTransactions(transactions);

    updateCards();
    updateChart()
    transactionForm.reset();

    model.style.display = "none";
});

function showTransactions(data) {

    transactionBody.innerHTML = "";

    data.forEach(function(item , index) {

        transactionBody.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>${item.amount}</td>
                <td>
                    <button class="editBtn" onClick = {editTransaction(${index})}>Edit</button>
                    <button class="deleteBtn" onClick = {deleteCards(${index})}>Delete</button>
                </td>
            </tr>
        `;

    });

}
showTransactions(transactions)

function updateCards(){
    let total = transactions.length
    let balance  = 0
    let income = 0
    let expense = 0
    transactions.forEach((elem , index)=>{
        if(elem.type === "Income"){
            income += elem.amount
        }
        else{
            expense += elem.amount
        }
    })
    balance = income-expense
    let currency = localStorage.getItem("currency") || "₹";

    currentBalance.textContent = currency + balance;
    totalIncome.textContent = currency + income;
    totalExpense.textContent = currency + expense;
    totalTransactions.textContent = total
}
updateCards()

let chart;

function updateChart() {
    let income = 0;
    let expense = 0;

    transactions.forEach(function(item){
        if(item.type === "Income"){
            income += item.amount;
        }
        else{
            expense += item.amount;
        }
    });

    const ctx = document.getElementById("cashChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels:["Income","Expense"],
            datasets:[{
                label:"Money",
                data:[income,expense],
                backgroundColor:["green","red"]
            }]
        }
    });
}

function deleteCards(index){
    transactions.splice(index,1)
    localStorage.setItem("transactions",JSON.stringify(transactions))

    showTransactions(transactions)
    updateCards()
    updateChart()
}
let editIndex = -1
function editTransaction(index){
    editIndex = index
    let item = transactions[index]

    title.value = item.title
    category.value = item.category
    date.value = item.date
    type.value  = item.type
    amount.value = item.amount

    model.style.display = "flex"
}

search.addEventListener("input",function(){
    let value = search.value.toLowerCase()
    let filtered = transactions.filter(function(item){
        return item.title.toLowerCase().includes(value)
    })
   showTransactions(filtered)
})

filterType.addEventListener("change",function(){
    let value = filterType.value
    if(value==="all"){
        showTransactions(transactions)
        return
    }
    
        let filtered = transactions.filter(function(item){
            return item.type.toLowerCase() === value
        })
    showTransactions(filtered)
})

resetBtn.addEventListener("click",function(){
    let check  = confirm("Are you sure to delete all transactions")
    if(!check) {
        return
    }
    transactions = []
    localStorage.removeItem("transactions")
    showTransactions(transactions)
    updateCards()
    updateChart()
    
})

darkMode.addEventListener("change",function(){

    document.body.classList.toggle("dark");

    localStorage.setItem("theme",darkMode.checked);

});

let savedTheme = localStorage.getItem("theme");

if(savedTheme==="true"){

    darkMode.checked = true;

    document.body.classList.add("dark");

}

if(localStorage.getItem("isLoggedIn")==="true"){

    login.style.display = "none";
    dashboard.style.display = "block";

    const savedName = localStorage.getItem("username");
    if(savedName){
        welcomeUser.textContent = `Hello, ${savedName}`;
    }

}else{

    login.style.display = "flex";
    dashboard.style.display = "none";

}
updateChart();
