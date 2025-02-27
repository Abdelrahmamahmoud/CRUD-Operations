let productName = document.getElementById("productName"),
  productPrice = document.getElementById("productPrice"),
  productCatagory = document.getElementById("productCatagory"),
  productImage = document.getElementById("productImage"),
  productDesc = document.getElementById("productDesc"),
  addBtn = document.getElementById("addBtn"),
  updateBtn = document.getElementById("updateBtn"),
  searchInpt = document.getElementById("searchInpt"),
  sortProductBtn = document.getElementById("sortProduct"),
  returnBack = document.getElementById("returnBack"),
  deleteAll = document.getElementById("deleteAll");
const imgExistingFile = document.querySelector(".imageFile");
let productList = [];
function fillValues(t) {
  (productName.value = `${t ? t.name : ""}`),
    (productDesc.value = `${t ? t.productDesc : ""}`),
    (productPrice.value = `${t ? t.price : ""}`),
    (productCatagory.value = `${t ? t.productCatagory : ""}`),
    t && t.productImage
      ? (imgExistingFile.classList.remove("d-none"),
        (imgExistingFile.src = t.productImage))
      : ((imgExistingFile.src = ""),
        imgExistingFile.classList.add("d-none"),
        (productImage.value = ""));
}
function addProduct() {
  if (
    validation(productName) &&
    validation(productPrice) &&
    validation(productCatagory) &&
    validation(productImage) &&
    validation(productDesc)
  ) {
    var t = {
      name: productName.value,
      price: productPrice.value,
      productCatagory: productCatagory.value,
      productImage: `./images/${productImage.files[0].name}`,
      productDesc: productDesc.value,
    };
    productList.push(t),
      addToLocalStorage(),
      displayProduct(productList),
      checkProductFound(productList),
      fillValues();
  } else
    Swal.fire({
      title: "Error!",
      text: "please enter valid information",
      icon: "error",
      confirmButtonText: "Cool",
    });
}
function displayProduct(t) {
  var e = "";
  t.forEach((t, d) => {
    e += `
     <div class="col-md-6 col-lg-3">
      <div class="card border-0 shadow-sm bg-white">
        <img src="${t.productImage}"  class="card-img-top" alt="..." />
        <div class="card-body">
          <div class="card-text d-flex justify-content-between">
           <span class="card-title badge bg-primary ">${
             t.productCatagory
           }</span>
            <span class="text-danger">${t.price}LE</span>
          </div>
            <span class="name">${t.title ? t.title : t.name}</span>
          <p class="productdesc mt-1">${t.productDesc}</p>
           <div class="d-flex justify-content-between">
            <span class="btn btn-outline-success edit" editIndex=${d} onclick="editProduct(this)"><i class="bi bi-pencil-fill"></i></span>
             <span class="btn btn-outline-danger" onclick="deleteProduct(${d})"><i class="bi bi-trash-fill"></i></span>
          </div>
        </div>
      </div>
    </div>
    `;
  }),
    (document.querySelector(".container .row").innerHTML = e);
}
function addToLocalStorage() {
  localStorage.setItem("data", JSON.stringify(productList));
}
function deleteProduct(t) {
  productList.splice(t, 1),
    displayProduct(productList),
    checkProductFound(productList),
    addToLocalStorage();
}
function deleteAllProduct() {
  displayProduct((productList = [])),
    checkProductFound(productList),
    addToLocalStorage();
}
function updateProduct() {
  validation(productName) &&
  validation(productPrice) &&
  validation(productCatagory) &&
  validation(productImage) &&
  validation(productDesc)
    ? ((productList[updateBtn.getAttribute("index")].name = productName.value),
      (productList[updateBtn.getAttribute("index")].productDesc =
        productDesc.value),
      (productList[updateBtn.getAttribute("index")].price = productPrice.value),
      (productList[updateBtn.getAttribute("index")].productCatagory =
        productCatagory.value),
      productImage.files.length > 0 &&
        (productList[
          updateBtn.getAttribute("index")
        ].productImage = `./images/${productImage.files[0].name}`),
      displayProduct(productList),
      addToLocalStorage(),
      addBtn.classList.remove("d-none"),
      updateBtn.classList.add("d-none"),
      fillValues())
    : Swal.fire({
        title: "Error!",
        text: "please enter valid information",
        icon: "error",
        confirmButtonText: "Cool",
      });
}
function editProduct(t) {
  fillValues(productList[t.getAttribute("editIndex")]),
    addBtn.classList.add("d-none"),
    updateBtn.classList.remove("d-none"),
    updateBtn.setAttribute("index", t.getAttribute("editIndex"));
}
function searchProductByTitle() {
  var t = [],
    e = 0;
  for (let d = 0; d < productList.length; d++)
    productList[d].name.toLowerCase().includes(searchInpt.value.toLowerCase())
      ? (t.push(productList[d]),
        (productList[d].title = productList[d].name
          .toLowerCase()
          .replaceAll(
            searchInpt.value.toLowerCase(),
            `<span class="text-danger">${searchInpt.value.toLowerCase()}</span>`
          )),
        document.querySelector("#searchInpt + span").classList.add("d-none"))
      : (!1 ==
          productList[d].name
            .toLowerCase()
            .includes(searchInpt.value.toLowerCase()) && e++,
        e == productList.length - 1 &&
          document
            .querySelector("#searchInpt + span")
            .classList.remove("d-none"));
  displayProduct(t);
}
function setValidationState(t, e) {
  e
    ? (t.classList.remove("is-invalid"),
      t.classList.add("is-valid"),
      t.nextElementSibling.classList.add("d-none"))
    : (t.classList.add("is-invalid"),
      t.nextElementSibling.classList.remove("d-none"));
}
function validation(t) {
  var e,
    d = {
      productName: /^[A-Z][a-z]{2,}(\s[aA-zZ]{0,}(\d+)?)?$/,
      productPrice: /^(6000|[6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
      productDesc: /^(\w|\s){0,250}$/,
      productCatagory: /(phones|smart screen|watches|Laptops)/,
      productImage: /^[^\s]+\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp)$/,
    };
  return (
    "file" === t.type
      ? productImage.files.length > 0
        ? ((e = d[t.id].test(t.files[0].name)),
          setValidationState(t, e),
          document.querySelector(".nofiles").classList.add("d-none"))
        : "" !== t.value || imgExistingFile
        ? imgExistingFile && (e = !0)
        : ((e = !1),
          document.querySelector(".nofiles").classList.remove("d-none"))
      : ((e = d[t.id].test(t.value)), setValidationState(t, e)),
    e
  );
}
function checkProductFound(t) {
  t.length > 0
    ? (document.querySelector("#searchInpt + span").classList.add("d-none"),
      sortProductBtn.classList.remove("d-none"),
      returnBack.classList.remove("d-none"),
      document.getElementById("deleteAll").classList.remove("d-none"))
    : (document.querySelector("#searchInpt + span").classList.remove("d-none"),
      sortProductBtn.classList.add("d-none"),
      returnBack.classList.add("d-none"),
      document.getElementById("deleteAll").classList.add("d-none"));
}
localStorage.getItem("data") &&
  displayProduct((productList = JSON.parse(localStorage.getItem("data")))),
  checkProductFound(JSON.parse(localStorage.getItem("data"))),
  sortProductBtn.addEventListener("click", function () {
    displayProduct(productList.sort((t, e) => t.price - e.price));
  }),
  returnBack.addEventListener("click", function () {
    (productList = JSON.parse(localStorage.getItem("data"))),
      displayProduct(JSON.parse(localStorage.getItem("data")));
  }),
  deleteAll.addEventListener("click", deleteAllProduct),
  searchInpt.addEventListener("input", searchProductByTitle);
