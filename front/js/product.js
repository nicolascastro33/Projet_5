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
    let nombreProduit = produitsId.nombre;
    if(nombreProduit > 0){
        if(foundId != undefined & foundColor != undefined){
            foundId.nombre += nombreProduit; 
        }else{
            listProduits.push(produitsId); 
        }
        saveProduits(listProduits); 
    }  
}; 

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
//     A essayer
// const selectColor = document.querySelector("#colors"); 
// const colorChoice = selectColor.options[selectColor.selectedIndex].value;  

// Bouton de commande et son effet 

let nombre = Number(this.document.querySelector("#quantity").value); 

let colorSelected = "";  
 
function color(colorSelected){
    document.querySelector("#colors").addEventListener("change", function() {
    colorSelected = this.value;
    console.log(this.value) 
});  
} 

let commande = {
    '_id' : `${idProduit}`,
    'color': colorSelected, 
    'nombre': nombre, 
}; 

const boutonCommander = document.querySelector(".item__content__addButton"); 
boutonCommander.addEventListener("click", function(){
    addProducts(commande)
}); 

// 1. Il faut permettre d'enregistrer la couleur dans le local storage
// 2. Les commandes avec 0 produit et/ou sans couleur sélectionner 
// ne peuvent pas rentrer dans le local storage
// 3. Les éléments avec une id et une couleur similaire doivent voir leur
// nombre augmenter du montant en question  