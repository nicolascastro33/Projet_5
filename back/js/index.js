// const produits = await fetch("http://localhost:3000/api/products").then(produits => produits.json()); 

// Création d'une boucle pour afficher mes produits sur la page d'accueil
let produits = window.localStorage.getItem('produits')

if(produits === null){
    const reponse = await fetch ("http://localhost:3000/api/products"); 
    produits =  reponse.json(); 

    const valeurProduits = JSON.stringify(produits); 

    window.localStorage.setItem("produits", valeurProduits); 
}else{
        produits = JSON.parse(produits); 
}; 


function genererProduits(produits){
    for(let i = 0; i < produits.length; i++){

        const sectionElement = document.querySelector(".items")        
        
        const produitElement = document.createElement("article"); 
        sectionElement.appendChild(produitElement); 

        const imageElement = document.createElement("img"); 
        imageElement.src = produits[i].imageUrl;
        produitElement.appendChild(imageElement);  


        const colorElement = document.createElement("p"); 
        colorElement.innerText = produits[i].colors;
        produitElement.appendChild(colorElement);  
 

        const idElement = document.createElement("p"); 
        idElement.innerText = produits[i]._id; 
        produitElement.appendChild(idElement);  

        const prixElement = document.createElement("p"); 
        prixElement.innerText = `Prix :${produits[i]._price} €`; 
        produitElement.appendChild(prixElement);  

        document.body.appendChild(produitElement); 
    }
}; 

genererProduits(produits); 

