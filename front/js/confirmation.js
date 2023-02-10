// Fonction pour récupérer et ensuite effacer le numéro de confirmation
async function getOrderId(){
    let validId = new RegExp(
        '^[a-zA-Z0-9]{8}[-]{1}[a-zA-Z0-9]{4}[-]{1}[a-zA-Z0-9]{4}[-]{1}[a-zA-Z0-9]{4}[-]{1}[a-zA-Z0-9]{12}$', 'g');
    const params = new URLSearchParams(window.location.search); 
    const idProduit = params.get("id"); 
    // Vérififcation si une commande à été passé
    if(idProduit == null){
        document.querySelector(".confirmation").innerHTML = "Aucune commande n'a été passé"
    }else if(validId.test(idProduit)){
        document.querySelector("#orderId").innerHTML = `${idProduit}`;
    }else{
        document.querySelector(".confirmation").innerHTML = "Le numéro de commande est invalide" 
    };
};

// Récupération numéro de commande 
getOrderId(); 

