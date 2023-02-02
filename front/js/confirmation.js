// Fonction pour récupérer et ensuite effacer le numéro de confirmation
async function getOrderId(){
    let order = await localStorage.getItem("order"); 
    if(order !== undefined){
        order = JSON.parse(order);
    }else{
        order = null
    }
    if(order !== null){
        document.querySelector("#orderId").innerHTML = `${order}`; 
    }else{
        document.querySelector(".confirmation").innerHTML = "Aucune commande n'a été passé"
    };
    localStorage.removeItem("order") 
};

// Récupération numéro de commande 
getOrderId(); 

