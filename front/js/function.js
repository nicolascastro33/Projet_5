// Function
export async function getProducts(){
    let listProduits = await localStorage.getItem("listProduits"); 
    if(listProduits == null){
        return []; 
    }else{
        return JSON.parse(listProduits); 
    }
};
  
export async function saveProduits(listProduits){
    localStorage.setItem("listProduits", JSON.stringify(listProduits)); 
};
  
   // Fonction nombre d'articles et total
export async function changementTotal(){
    let totalQuantity = Number(""); 
    let totalPrice = Number("");
    let listProduits = await getProducts();
  
    for(let produits of listProduits){
      await fetch(`http://localhost:3000/api/products/${produits._id}`)
      .then(data => data.json())
      .then(jsonListElement => {
        totalQuantity += Number(produits.number); 
        totalPrice += produits.number * jsonListElement.price
        document.querySelector("#totalPrice").innerHTML = `${totalPrice}` ; 
        document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}` ; 
        }); 
    };
}; 
  
  // Function pour effacer un élément
  
export async function deleteProducts(event) {
const element = event.target.closest('article'); 
const messageSuppression = event.target.closest('.cart__item__content__settings'); 
const colorIdProduit = element.dataset.color; 
const idProduit = element.dataset.id; 
let listProduits = await getProducts();
let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
const foundIdIndex = listProduits.indexOf(foundId); 
listProduits.splice(foundIdIndex, 1); 
messageSuppression.innerHTML = `Vos articles ont bien été supprimez de votre panier`;   
saveProduits(listProduits);
}; 
  
// Function pour modifier le nombre d'éléments
export async function modifierNombre(event){
    const elementNumber = event.target.value
    const element = event.target.closest('article')
    const colorIdProduit = element.dataset.color;
    const idProduit = element.dataset.id;
    let listProduits = await getProducts();
    let foundId = listProduits.find(p => (p._id == idProduit) && (p.color == colorIdProduit));
    foundId.number = Number(elementNumber);
    if(foundId.number > 100){
        foundId.number = 100; 
        window.alert("Trop d'articles dans le panier!")
    }
    saveProduits(listProduits);
    changementTotal();   
}; 
  
  // Fonction Post de données
export async function postDonnees(url = '', data = {}){
    const reponse = await fetch (url, {
        method: "POST", 
        headers: {"Content-type": "application/json"}, 
        body: JSON.stringify(data), 
    });
    reponse.json();  
}; 

  
  // Fonction Validation contact
  // Valider mail
export function validEmail(inputEmail) {
    let emailRegExp = new RegExp(
        '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'
    );

    let small = inputEmail.nextElementSibling; 

    if(emailRegExp.test(inputEmail.value)){
        small.innerHTML = "Your email address is valid"; 
        small.style.color = 'green'
    }else{ 
        small.innerHTML = "Your email address is invalid"; 
        small.style.color = 'red'
    }; 
};

// Valider autres éléments
export function validElement(input) {
    let elementRegExp = new RegExp(
        '^[a-zA-Z]+$', 'g'
    );

    let small = input.nextElementSibling; 

    if(elementRegExp.test(input.value)){
        small.innerHTML = `Your ${input.name} is valid`; 
        small.style.color = 'green'
    }else{ 
        small.innerHTML = `Your  ${input.name} is invalid`; 
        small.style.color = 'red'
    }; 
}; 
  
  // Fonction Data formulaire 
  export async function getDataFormulaire(){
    let data = {};
    let valid = true;
    const inputs = document.querySelectorAll(".cart__order input"); 
    // Vérification des données, si elles sont conformes
    for(let input of inputs){
      valid &= input.reportValidity(); 
      if(!valid){
        break;
      }
    };
    // Création array contenant les éléments à envoyer 
    if(valid){
      const listProduits = await getProducts(); 
      let idProduits = [];
      // Création d'une liste contenant seulement les Id concernées
      for(let produits of listProduits){
        idProduits.push(produits._id); 
        };
      // } 
      data = {
        firstName : document.querySelector('.cart__order input[name="firstName"]').value, 
        lastName : document.querySelector('.cart__order input[name="lastName"]').value, 
        adress : document.querySelector('.cart__order input[name="address"]').value, 
        city : document.querySelector('.cart__order input[name="city"]').value, 
        email : document.querySelector('.cart__order input[name="email"]').value, 
        orderId : idProduits, 
      };  
    };
    return data
  }; 
  
  export async function commande(){
    data = await getDataFormulaire(); 
    console.log(data);
    await postDonnees(`http://localhost:3000/api/products/order`, data)
      // Lien vers la page de confirmation 
      // location.href="http://127.0.0.1:5500/front/html/confirmation.html"; 
  }; 