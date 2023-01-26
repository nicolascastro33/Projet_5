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
    let listProduits = getProducts();
    let foundId = listProduits.find(p => p.id == produitsId.id);
    let foundColor = listProduits.find(p => p.color == produitsId.color );
    let nombreProduit = produitsId.number;
    let colorProduit = produitsId.color; 
    if(nombreProduit <= 0){
        window.alert("Pas assez d'article");
    }else if(colorProduit == undefined){
        window.alert("Pas de couleur sélectionnée"); 
    }else if(foundId != undefined & foundColor != undefined){
            foundId.number += nombreProduit; 

    }else{
            listProduits.push(produitsId); 
    }
    saveProduits(listProduits); 
}  
; 

// && produitsId.color != ""
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
const colorNumber = selectNumber.addEventListener("change", function() {
    commande.number = Number(this.value);
    console.log(this.value) 
});  

const boutonCommander = document.querySelector(".item__content__addButton"); 
boutonCommander.addEventListener("click", function(){
    addProducts(commande)
}); 

// 1. De bien mettre les bons éléments dans la bonne boite 