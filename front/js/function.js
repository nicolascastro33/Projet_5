// Fonction pour le bouton commander
export function getProducts(){
    let listProduits = localStorage.getItem("listProduits"); 
    if(listProduits == null){
        return []; 
    }else{
        return JSON.parse(listProduits); 
    }
}

export function saveProduits(listProduits){
    localStorage.setItem("listProduits", JSON.stringify(listProduits)); 
}


export function addProducts(produitsId){
    let listProduits = getProducts();
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
    }else{
            listProduits.push(produitsId); 
    }
    saveProduits(listProduits); 
};

export function deleteProducts(produitsId){
    let listProduits = getProducts();
    let foundId = listProduits.find(p => (p._id == produitsId._id) && (p.color == produitsId.color));
    listProduits.
    saveProduits(listProduits); 
}