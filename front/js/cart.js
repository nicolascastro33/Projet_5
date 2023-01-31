// import * from "./function";

// Function
function getProducts(){
  let listProduits = localStorage.getItem("listProduits"); 
  if(listProduits == null){
      return []; 
  }else{
      return JSON.parse(listProduits); 
  }
}

function saveProduits(listProduits){
  localStorage.setItem("listProduits", JSON.stringify(listProduits)); 
}

 // Fonction nombre d'articles et total
 function changementTotal(){
  let totalQuantity = Number(""); 
  let totalPrice = Number("");
  let listProduits = getProducts();

  for(let produits of listProduits){
    fetch(`http://localhost:3000/api/products/${produits._id}`)
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

function deleteProducts(event) {
  const element = event.target.closest('article'); 
  const messageSuppression = event.target.closest('.cart__item__content__settings'); 
  const colorIdProduit = element.dataset.color; 
  const idProduit = element.dataset.id; 
  let listProduits = getProducts();
  let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
  const foundIdIndex = listProduits.indexOf(foundId); 
  listProduits.splice(foundIdIndex, 1); 
  messageSuppression.innerHTML = `Vos articles ont bien été supprimez de votre panier`;   
  saveProduits(listProduits);
}; 

// Function pour modifier le nombre d'éléments

function modifierNombre(event){
  const elementNumber = event.target.value
  const element = event.target.closest('article')
  const colorIdProduit = element.dataset.color;
  const idProduit = element.dataset.id;
  let listProduits = getProducts();
  let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
  foundId.number = Number(elementNumber);
  if(foundId.number > 100){
    foundId.number = 100; 
    window.alert("Trop d'articles dans le panier!")
  }
  saveProduits(listProduits);
  changementTotal();   
 }; 


// Fonction Valider mail
function validEmail(inputEmail) {
  let emailRegExp = new RegExp(
    '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'
  );

  let small = inputEmail.nextElementSibling; 

  if(emailRegExp.test(inputEmail.value)){
    small.innerHTML = "Votre email est valide"; 
  }else{ 
    small.innerHTML = `Votre email est invalide`; 
  }; 
}


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


// Fonction POST COMMANDE
function ajoutListenerCommande(event){
  const listProduits = getProducts(); 
  const data = {
    firstName : event.target.querySelector("[name=firstName]").value, 
    lastName : event.target.querySelector("[name=lasttName]").value, 
    adress : event.target.querySelector("[name=adress]").value, 
    city : event.target.querySelector("[name=city]").value, 
    email : event.target.querySelector("[name=email]").value, 
    orderId : listProduits, 
  };
  const contact = JSON.stringify(data);
  fetch(`http://localhost:3000/api/products`), {
    method: "POST", 
    headers: {"Content-type": "application/json"}, 
    body: contact, 
  } 
};


// Partie Contact
document.querySelector('.cart__order input[type="submit"]').addEventListener("submit", function(event){
  let valid = true; 
  const inputs = document.querySelectorAll(".cart__order input"); 
  // Vérification des données, si elles sont conformes
  for(let input of inputs){
    valid &= input.reportValidity(); 
    if(!valid){
      break;
    }
  };
  // Création array contenant les éléments à envoyer 
  if(valid){
    ajoutListenerCommande(event); 
    // Message de validation commande 
    window.alert("Votre message a bien été envoyé"); 
  }
}); 

// Vérifier email
let form = document.querySelector(".cart__order__form"); 
form.email.addEventListener('change', function() {
  validEmail(form.email); 
}); 


// Finir la partie Contact
// Faire le plan d'acceptation
// créer un message de confirmation 





