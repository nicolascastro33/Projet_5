// import { addProducts } from "./function";

// Fonction pour le bouton commander
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


function addProducts(produitsId){
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
}  
; 

// Récupération données pour chaque pages 
const params = new URLSearchParams(window.location.search); 
const idProduit = params.get("id"); 

fetch(`http://localhost:3000/api/products/${idProduit}`)
    .then(data => data.json())
    .then(jsonListProduit => {
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
        }
    }); 

// Bouton de commande et son effet 
let commande = {
    '_id' : `${idProduit}`, 
    'number' : Number(document.querySelector("#quantity").value)
}; 

const selectColor = document.querySelector("#colors"); 
const colorChoice = selectColor.addEventListener("change", function() {
    commande.color = this.value;
    console.log(this.value) 
});  

const selectNumber = document.querySelector("#quantity"); 
const numberChoice = selectNumber.addEventListener("change", function() {
    commande.number = Number(this.value);
    console.log(this.value) 
});  

const boutonCommander = document.querySelector(".item__content__addButton"); 
boutonCommander.addEventListener("click", function(){
    addProducts(commande)
}); 
