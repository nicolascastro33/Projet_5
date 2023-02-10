// // Function
// Fonction obtenir le local storage
async function getProducts(){
  let listProduits = await localStorage.getItem("listProduits"); 
  if(listProduits == null){
      return []; 
  }else{
      return JSON.parse(listProduits); 
  }
};

// Fonction sauver sur le local storage
async function saveProduits(listProduits){
  localStorage.setItem("listProduits", JSON.stringify(listProduits)); 
};

 // Fonction nombre d'articles et total
async function changementTotal(){
  let totalQuantity = Number(""); 
  let totalPrice = Number("");
  let listProduits = await getProducts();

  for(let produits of listProduits){
    await fetch(`http://localhost:3000/api/products/${produits._id}`)
    .then(data => data.json())
    .then(jsonListElement => {
      totalQuantity += Number(produits.number); 
      totalPrice += produits.number * jsonListElement.price
      document.querySelector("#totalPrice").innerHTML = `${totalPrice}` ; 
      document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}` ; 
      }); 
  };
}; 

// Function pour effacer un élément

async function deleteProducts(event) {
const element = event.target.closest('article'); 
const messageSuppression = event.target.closest('.cart__item__content__settings'); 
const colorIdProduit = element.dataset.color; 
const idProduit = element.dataset.id; 
let listProduits = await getProducts();
let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
const foundIdIndex = listProduits.indexOf(foundId); 
listProduits.splice(foundIdIndex, 1); 
messageSuppression.innerHTML = `Vos articles ont bien été supprimez de votre panier`;   
saveProduits(listProduits);
setTimeout(() => {document.location.href = "cart.html"}, 500); 


}; 

// Function pour modifier le nombre d'éléments
async function modifierNombre(event){
  const elementNumber = event.target.value
  const element = event.target.closest('article')
  const colorIdProduit = element.dataset.color;
  const idProduit = element.dataset.id;
  let listProduits = await getProducts();
  let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
  foundId.number = Number(elementNumber);
  if(foundId.number > 100){
      foundId.number = 100; 
      window.alert("Trop d'articles dans le panier!")
  }
  saveProduits(listProduits);
  changementTotal();   
}; 


// Fonction Validation contact
// Valider mail
function validEmail(inputEmail) {
  let emailRegExp = new RegExp(
      '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'
  );

  let small = inputEmail.nextElementSibling; 

  if(emailRegExp.test(inputEmail.value)){
      small.innerHTML = "Your email is valid"; 
      small.style.color = 'green'
  }else{
    if(inputEmail.value == ""){
      small.innerHTML = "Your email is missing"; 
      small.style.color = 'red'
    }else{ 
      small.innerHTML = "Your email is invalid"; 
      small.style.color = 'red'
      };
  };     
};

// Valider autres éléments
function validElement(input) {
  let elementRegExp = new RegExp(
      '^[a-zA-Z]+$', 'g'
  );

  let small = input.nextElementSibling; 

  if(elementRegExp.test(input.value)){
      small.innerHTML = `Your ${input.name} is valid`; 
      small.style.color = 'green'
  }else{
    if(input.value == ""){ 
      small.innerHTML = `Your  ${input.name} is missing`; 
      small.style.color = 'red'
    }else{
      small.innerHTML = `Your  ${input.name} is invalid`; 
      small.style.color = 'red'
    }
  }; 
}; 

// Fonction Data formulaire 
async function getDataFormulaire(){
  const listProduits = await getProducts(); 
  let valid = true;
  let order = [];
  let data = {}; 
  const inputs = document.querySelectorAll(".cart__order input"); 
  // Vérification des données, si elles sont conformes
  for(let input of inputs){
    let small = input.nextElementSibling; 
    let elementRegExp = new RegExp('^[a-zA-Z]+$', 'g');
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'); 
    // Vérification de l'email 
    if(input.name == "email"){
      if(emailRegExp.test(input.value)){
        small.innerHTML = `Your ${input.name} is valid`; 
        small.style.color = 'green'
      }else{
        if(inputEmail.value == ""){
          small.innerHTML = `Your  ${input.name} is missing`; 
          small.style.color = 'red'
        }else{
          small.innerHTML = `Your  ${input.name} is invalid`; 
          small.style.color = 'red'
        }  
        valid = false
        break
      }; 
    // Vérification des autres éléments sauf l'input submit 
    }else if(input.id !== "order"){
      if(elementRegExp.test(input.value)){
      small.innerHTML = `Your ${input.name} is valid`; 
      small.style.color = 'green'
      }else{
        if(input.value == ""){
          small.innerHTML = `Your  ${input.name} is missing`; 
          small.style.color = 'red'
        }else{
          small.innerHTML = `Your  ${input.name} is invalid`; 
          small.style.color = 'red'
        } 
        valid = false
        break; 
      }; 
    }; 
  };
  // Création array contenant les éléments à envoyer 
  if(valid){
    // Création d'une liste contenant seulement les Id concernées
    for(let produits of listProduits){
      order.push(produits._id); 
      };
    data = {      
      "firstName" : document.querySelector('.cart__order input[name="firstName"]').value, 
      "lastName" : document.querySelector('.cart__order input[name="lastName"]').value, 
      "address" : document.querySelector('.cart__order input[name="address"]').value, 
      "city" : document.querySelector('.cart__order input[name="city"]').value, 
      "email" : document.querySelector('.cart__order input[name="email"]').value,
      "orderId" : order, 
    };
    // Envoie des données vers l'api
    await postDonnees(`http://localhost:3000/api/products/order`, data)  
  };
}; 

// Fonction Post de données
async function postDonnees(url = '', data = {}){
  const products = data.orderId;
  delete data.orderId; 
  const contact = data; 
  console.log(contact); 
  console.log(products);
    // Vérification si il y a des éléments dans le panier 
  if(products == null || products.length < 1){
    window.alert("Vous n'avez pas de produits dans votre panier!")
  }else{
    // Envoie des éléments dans l'api via POST
    await fetch (url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ contact, products }),
    })
    .then((response) => response.json())
    .then((data) => {
      // Effacement du Local Storage  
      localStorage.clear() 
      // Redirection vers la page confirmation 
      setTimeout(() => {document.location.href = `confirmation.html?id=${data.orderId}`}, 1000); 
    })
    .catch(error => console.error("Il semble qu'il y est un problème avec votre commande, veuillez réessayer plus tard"));  
  }
}; 
// Fin des fonctions

//  Récupération des données et affichage du panier
const produitPanier = window.localStorage.getItem("listProduits"); 
const jsonProduitPanier = JSON.parse(produitPanier)
if(jsonProduitPanier == null){
  console.log()
}else{
  for(let produits of jsonProduitPanier){
    fetch(`http://localhost:3000/api/products/${produits._id}`)
    .then(data => data.json())
    .then(jsonListElement => {
        document.querySelector("#cart__items").innerHTML += 
            `<article class="cart__item" data-id="${produits._id}" data-color="${produits.color}">
            <div class="cart__item__img">
              <a href="./product.html?id=${produits._id}"><img src="${jsonListElement.imageUrl}" alt="${jsonListElement.altTxt}"></a>
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${jsonListElement.name}</h2>
                <p>${produits.color}</p>
                <p>${jsonListElement.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté :</p>
                  <input onchange="modifierNombre(event)" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produits.number}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p onclick="deleteProducts(event)" class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
    }); 
  };
}; 
 
changementTotal(); 

// Partie Contact
 document.querySelector('.cart__order input[type="submit"]').addEventListener("click", function(event){
  event.preventDefault(); 
  getDataFormulaire(); 
}); 

// Vérifications Contact
let form = document.querySelector(".cart__order__form");  

form.firstName.addEventListener('change', function() {
  validElement(form.firstName); 
}); 
form.lastName.addEventListener('change', function() {
  validElement(form.lastName); 
}); 
form.address.addEventListener('change', function() {
  validElement(form.address); 
});
form.city.addEventListener('change', function() {
  validElement(form.city); 
}); 
form.email.addEventListener('change', function() {
  validEmail(form.email); 
});
