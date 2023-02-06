// Fonction pour récupérer et ensuite effacer le numéro de confirmation
async function getOrderId(){
    const params = new URLSearchParams(window.location.search); 
    const idProduit = params.get("id"); 
    // Vérififcation si une commande à été passé
    if(idProduit !== null){
        document.querySelector("#orderId").innerHTML = `${idProduit}`; 
    }else{
        document.querySelector(".confirmation").innerHTML = "Aucune commande n'a été passé"
    };
};

// Récupération numéro de commande 
getOrderId(); 

