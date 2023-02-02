// // Function

async function getProducts(){
  let listProduits = await localStorage.getItem("listProduits"); 
  if(listProduits == null){
      return []; 
  }else{
      return JSON.parse(listProduits); 
  }
};

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
document.location.href = "cart.html"; 

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
      small.innerHTML = "Your email address is valid"; 
      small.style.color = 'green'
  }else{ 
      small.innerHTML = "Your email address is invalid"; 
      small.style.color = 'red'
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
      small.innerHTML = `Your  ${input.name} is invalid`; 
      small.style.color = 'red'
  }; 
}; 

// Fonction Data formulaire 
async function getDataFormulaire(){
  let valid = true;
  let order = [];
  let data = {}; 
  const inputs = document.querySelectorAll(".cart__order input"); 
  // Vérification des données, si elles sont conformes
  for(let input of inputs){
    valid &= input.reportValidity(); 
    if(!valid){
      if(input.name !== "email"){
        validElement(input);
      }else{
        validEmail(input);
      }
      break; 
    }
  };
  // Création array contenant les éléments à envoyer 
  if(valid){
    const listProduits = await getProducts(); 
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
  const produits = data.orderId;
  delete data.orderId; 
  const contact = data; 
  console.log(contact); 
  console.log(produits); 
  await fetch (url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ contact, produits }),
  })
  .then((response) => response.json())
  .then((data) => { 
    localStorage.setItem("order", JSON.stringify(data)) 
    // document.location.href = "confirmation.html"; 
    // .catch((erreur) => console.log("erreur : " + erreur));
  })
  // .catch((erreur) => console.log("erreur : " + erreur))
}; 

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
 

// Problèmes
// débugger la confirmation des éléments sur la partie contact
// Mettre les fonctions dans la partie fonction 
// réussir à envoyer les données à api

// Faire le plan d'acceptation
// créer un message de confirmation 