// Fonction pour le bouton commander
function addProducts(produitsId){
    let listProduits = getProducts(); 
    listProduits.push(produitsId)
    saveProduits(listProduits); 
}; 


function getProducts(){
    let listProduits = localStorage.getItem("panierProduits"); 
    if(listProduits == null){
        return []; 
    }else{
        return JSON.parse(listProduits); 
    }
}

function saveProduits(listProduits){
    localStorage.setItem("listProduits", JSON.stringify(listProduits)); 
}
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

let commande = {
    '_id' : `${idProduit}`,
    'color': document.querySelector("#colors").value , 
    'nombre': document.querySelector("#quantity").value, 
}; 
const boutonCommander = document.querySelector(".item__content__addButton"); 
boutonCommander.addEventListener("click", function(){
    addProducts(commande)
}); 

