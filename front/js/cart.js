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
  const element = event.target.closest('article')
  const colorIdProduit = element.dataset.color; 
  const idProduit = element.dataset.id; 
  let listProduits = getProducts();
  let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
  const foundIdIndex = listProduits.indexOf(foundId); 
  listProduits.splice(foundIdIndex, 1)
  document.querySelector(".cart__item__content__settings").innerHTML = "<p>Vos articles ont bien été supprimez de votre panier</p>";   
  saveProduits(listProduits);
}; 

// Function pour modifier le nombre d'éléments

function modifierNombre(event){
  const elementNumbre = event.target.value
  const element = event.target.closest('article')
  const colorIdProduit = element.dataset.color;
  const idProduit = element.dataset.id;
  let listProduits = getProducts();
  let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
  foundId.number = elementNumbre;
  if(foundId.number > 100){
    foundId.number = 100; 
    window.alert("Trop d'articles dans le panier!")
  }
  saveProduits(listProduits);
  changementTotal();   
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
document.querySelector('.cart__order input[type="submit"]').addEventListener("click", function(){
  let valid = true; 
  const inputs = document.querySelectorAll(".cart__order input"); 
  for(let input of inputs){
    valid &= input.reportValidity(); 
    if(!valid){
      let idError = input.id; 
      let nameError = input.name; 
      document.querySelector(`#${idError}ErrorMsg`).innerText = `Your ${nameError}'s missing!`; 
      break;
    }
  }; 
  if(valid){
    window.alert("Votre message a bien été envoyé"); 
  }
}); 


// Finir la partie Contact
// S'occuper de la partie total 
// Faire le plan d'acceptation
// créer un message de confirmation 





