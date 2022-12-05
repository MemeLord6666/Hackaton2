// API
let API = " http://localhost:8000/students"
let inpSurname = document.querySelector(".section_add_surname")

// Inputs and btn
let inpName = document.querySelector(".section_add_name")
let inpNumber = document.querySelector(".section_add_number")
let inpWeek = document.querySelector(".section_add_resultWeek")
let inpPhoto = document.querySelector(".section_add_photo")
let btnAdd = document.querySelector(".section_add_btn-add")

let inpSearch = document.querySelector(".search-txt")
let searchValue = inpSearch.value


let prevBtn = document.querySelector("#prev-btn")
let nextBtn = document.querySelector("#next-btn")
let currentPage = 1
let limit = 4

// DIV
let section_add = document.querySelector(".section_add")
let sectionRead = document.getElementById("section__read")
let accordion = document.querySelector(".accordion_header")
let table = document.querySelector("table")

let clickAdmin = document.getElementById("open-admin")
let admin_panel_arr = document.getElementsByClassName("admin-panel")
let code = ""

let inpEditSurname = document.querySelector(".window__edit_surname")
let inpEditName = document.querySelector(".window__edit_name")
let inpEditNumber = document.querySelector(".window__edit_number")
let inpEditWeek = document.querySelector(".window__edit_resultWeek")
let inpEditPhoto = document.querySelector(".window__edit_photo")
let btnEditAdd = document.querySelector(".window__edit_btn-save")
let btnClose1 = document.querySelector(".window__edit_close")
let mainModal = document.querySelector(".main-modal")
function adminReturn (){
    if(code != "1"){
      setTimeout(()=>{
        for(let i of admin_panel_arr){
          i.style.display = "none";
        }
      }, 50)
      section_add.style.display = "none"
    }else {
      setTimeout(()=>{
        for(let i of admin_panel_arr){
          i.style.display = "block";
        }
      }, 50)
      section_add.style.display = "block"
    }
}

clickAdmin.addEventListener("click", ()=>{
    code = prompt("Введите ключевое слово")
    if(code === "1"){
        alert("Добро пожаловать!")
        adminReturn() 
    }else{
        alert("Неправильно")
    }
})
accordion.addEventListener("click", ()=>{
    accordion.classList.toggle("active")
    let accordionBody = document.getElementById("accordion_body")
    if(accordion.classList.contains("active")){
        accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
    } else {
        accordionBody.style.maxHeight = 0
    }
})
function createProduct(obj){
    fetch(API, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(obj),
    }).then((res)=> res.json())
    readProducts()
}

btnAdd.addEventListener("click", ()=>{
    // ? Проверка на заполненность полей
    if(
        !inpSurname.value.trim() ||
        !inpName.value.trim() ||
        !inpNumber.value.trim() ||
        !inpWeek.value.trim() ||
        !inpPhoto.value.trim() 
        ){
            alert("Заполните поля!")
        };
    let obj = {
        surname: inpSurname.value,
        name: inpName.value,
        number: inpNumber.value,
        week: inpWeek.value,
        photo: inpPhoto.value,
    };
    createProduct(obj);
  inpSurname.value = "";
  inpName.value = "";
  inpNumber.value = "";
  inpWeek.value = "";
  inpPhoto.value = url;
});

// !CREATE END
async function readProducts() {
    let data = await fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=${limit}`).then((res) => res.json());
    table.innerHTML = "";
    data.forEach((item) => {
      let tr = document.createElement("tr")
      tr.innerHTML += `
      
         <td class='block'> <img id='img_r' src="${item.photo}"  alt="logo"></td>
          <td>${item.surname}</td>
          <td>${item.name}</td>
          <td>${item.number}</td>
          <td>${item.week}</td>
          <td>
        <button class="delete" onclick="deleteStudent(${item.id})">Удалить</button>
        <button id=${item.id} onclick="ooo(${item.id})">Изменить</button>
        </td>
     ` ;
      table.append(tr)
    });
    pageTotal()
    adminReturn()
  }
  readProducts();

// ! DELETE START
async function deleteStudent(id){
  fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  readProducts()
}
// ! DELETE END

// !EDIT START
async function editProduct(id, editedObj){
  if(
    !inpEditSurname.value.trim() ||
    !inpEditName.value.trim() ||
    !inpEditNumber.value.trim() ||
    !inpEditWeek.value.trim() ||
    !inpEditPhoto.value.trim() 
  ){
    alert("Заполните поля")
    return
  }
  await fetch(`${API}/${id}`,{
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(editedObj),
  })
  readProducts();
}
let editId = ""
async function ooo(id){
mainModal.style.display = "block"
let data = await fetch(`${API}/${id}`).then((res)=>res.json())
inpEditSurname.value = data.surname
inpEditName.value = data.name
inpEditNumber.value = data.number
inpEditWeek.value = data.week
inpEditPhoto.value = data.photo
editId = data.id
}

btnClose1.addEventListener("click", ()=>{
  mainModal.style.display = "none"
})

btnEditAdd.addEventListener("click", ()=>{
let editedObj = {
  surname: inpEditSurname.value,
  name: inpEditName.value,
  number: inpEditNumber.value,
  week: inpEditWeek.value,
  photo: inpEditPhoto.value,
}
editProduct(editId, editedObj)
mainModal.style.display = "none"
})
  

inpSearch.addEventListener("input", (e)=>{
  searchValue = e.target.value
  readProducts()
})


let countPage = 1
async function pageTotal(){
  let data = await fetch(`${API}?q=${searchValue}`).then((res)=>res.json())
  countPage = Math.ceil(data.length / limit)
}

prevBtn.addEventListener("click", ()=>{
  if(currentPage <=1) return
  currentPage--
  readProducts()
})

nextBtn.addEventListener("click", ()=>{
  if(currentPage >= countPage) return
  currentPage++
  readProducts()
})