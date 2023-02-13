// Fonctions
// Fonction pour le bouton commander
async function getProducts(){
    let listProduits = localStorage.getItem("listProduits"); 
    if(listProduits == null){
        return []; 
    }else{
        return JSON.parse(listProduits); 
    }
}
// Fonction pour enregistrer le produit dans le local storage 
async function saveProduits(listProduits){
    localStorage.setItem("listProduits", JSON.stringify(listProduits)); 
}

// Fontion pour rajouter un produit
async function addProducts(produitsId){
    let listProduits = await getProducts();
    let foundId = listProduits.find(p => (p._id == produitsId._id) && (p.color == produitsId.color));
    let nombreProduit = produitsId.number;
    let colorProduit = produitsId.color;
    const confirmation = document.querySelector(".item__content");  
    if(nombreProduit <= 0){
        window.alert("Pas assez d'article");
    }else if(colorProduit === undefined){
        window.alert("Pas de couleur sélectionnée");
    }else if(colorProduit === ""){
        window.alert("Pas de couleur sélectionnée");
    }else if(foundId != undefined){
        foundId.number += nombreProduit;
        if(foundId.number > 100){
            foundId.number = 100; 
            window.alert("Trop d'articles dans le panier!")
        }
        confirmation.innerHTML += "<p>Vos articles ont bien été rajouté à votre panier</p>"; 
        saveProduits(listProduits);
        setTimeout(() => {document.location.href = `product.html?id=${idProduit}`}, 1000);  
    }else{
        listProduits.push(produitsId);
        confirmation.innerHTML += "<p>Vos articles ont bien été rajouté à votre panier</p>"
        saveProduits(listProduits);   
        setTimeout(() => {document.location.href = `product.html?id=${idProduit}`}, 1000);
    }   
}; 
// Fin des fonctions



// Récupération données pour chaque pages 
const params = new URLSearchParams(window.location.search); 
const idProduit = params.get("id"); 

fetch(`http://localhost:3000/api/products/${idProduit}`)
    .then(data => data.json())
    .then(jsonListProduit => {
        // Message d'erreur si l'article n'existe pas
        if(Object.keys(jsonListProduit).length === 0 && jsonListProduit.constructor === Object){
            const errorMessage = document.querySelector(".item"); 
            errorMessage.innerHTML = `<p>L'article ${idProduit} n'existe pas, veuillez choisir un article existant dans la page d'accueil.</p>`
            errorMessage.style.textAlign = "center"
        }else{
         // Création des propriétés de l'article
        // Images
            const lienImage = document.querySelector('.item__img');
            const imageElement = document.createElement("img");
            imageElement.src = jsonListProduit.imageUrl;
            lienImage.appendChild(imageElement);
            // Nom
            const nomElement = document.querySelector('#title');
            nomElement.innerText = jsonListProduit.name; 
            // Prix
            const prixElement = document.querySelector('#price');
            prixElement.innerText = jsonListProduit.price; 
            // Description
            const descriptionElement = document.querySelector('#description');
            descriptionElement.innerText = jsonListProduit.description; 
            // Couleurs
            for(let colors of jsonListProduit.colors){
                document.querySelector("#colors").innerHTML +=
                    `<option value="${colors}">${colors}</option>` 
            }; 
        }
    })
    .catch(error => console.error("Il semble qu'il y est un problème avec cette article, veuillez réessayer plus tard"));  

// Bouton de commande et son effet 
let commande = {
    '_id' : `${idProduit}`, 
    'number' : Number(document.querySelector("#quantity").value)
}; 

// Changement de couleur
const selectColor = document.querySelector("#colors"); 
const colorChoice = selectColor.addEventListener("change", function() {
    commande.color = this.value;
});  

// Changement de nombre
const selectNumber = document.querySelector("#quantity"); 
const numberChoice = selectNumber.addEventListener("change", function() {
    commande.number = Number(this.value);
});  

// Fonction du clic de la commande
const boutonCommander = document.querySelector(".item__content__addButton"); 
boutonCommander.addEventListener("click", function(){
    addProducts(commande)
}); 
