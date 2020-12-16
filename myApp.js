let ourForm =document.getElementById("Ourform")
let ourFeild = document.getElementById("ourFeild")
let ourList = document.getElementById("ourList")
ourForm.addEventListener("submit",(e) => {
  e.preventDefault()
  createItem(ourFeild.value)
  
})

function createItem (x) {
  ourHTML=`<li>${x}<button>Remove</button></li>`
  ourList.insertAdjacentHTML("beforeend",ourHTML)
  
}