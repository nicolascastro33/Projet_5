// Récupérer le local storage
export function getProducts(){
    let listProduits = localStorage.getItem("listProduits"); 
    if(listProduits == null){
        return []; 
    }else{
        return JSON.parse(listProduits); 
    }
}
// Sauvegardez le local storage
export function saveProduits(listProduits){
    localStorage.setItem("listProduits", JSON.stringify(listProduits)); 
}
// Fonction nombre d'articles et total
export function changementTotal(){
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


// Fonction pour ajouter un produit au panier
export function addProducts(produitsId){
    // window.("Êtes-vous sûr de vouloir rajouté ces articles dans votre panier?")
    let listProduits = getProducts();
    let confirmationCommande = document.querySelector(".item__content__addButton"); 
    let foundId = listProduits.find(p => (p._id == produitsId._id) && (p.color == produitsId.color));
    let nombreProduit = produitsId.number;
    let colorProduit = produitsId.color; 
    if(nombreProduit <= 0){
        window.alert("Pas assez d'article");
    }else if(colorProduit === undefined){
        window.alert("Pas de couleur sélectionnée");
    }else if(colorProduit === ""){
        window.alert("Pas de couleur sélectionnée");
    }else if(foundId != undefined){
            foundId.number += nombreProduit;
            document.querySelector(".item__content__addButton").innerHTML = "<p>Vos articles ont bien été rajouté à votre panier</p>";   
        }else{
            listProduits.push(produitsId);
            document.querySelector(".item__content__addButton").innerHTML = "<p>Vos articles ont bien été rajouté à votre panier</p>";   
    }
    saveProduits(listProduits); 
};

// Function pour effacer un élément
export function deleteProducts(event) {
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
export function modifierNombre(event){
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
    };