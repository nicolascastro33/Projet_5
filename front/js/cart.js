// Effacer un éléments
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
function deleteProducts(produitsId){
  let listProduits = getProducts();
  let foundId = listProduits.find(p => (p._id == produitsId._id) && (p.color == produitsId.color));
  let indexProduit = listProduits.indexOf(foundId); 
  for(let i = 0; i < listProduits.length; i++){ 
    if ( listProduits[i] === indexProduit) { 
        listProduits.splice(i, 1); 
    }
}
  saveProduits(listProduits); 
} 

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
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produits.number}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
          const dataCommande = {
            '_id' : `${produits._id}`, 
            'color' : produits.color, 
        }; 
          const boutonSupprimer = this.document.querySelector(".deleteItem"); 
          boutonSupprimer.addEventListener("click", function(){
          console.log("delete")
          deleteProducts(dataCommande)
        });
    });  
  };
}
