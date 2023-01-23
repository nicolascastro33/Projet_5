// Gérer l'affichage des éléments sur la page d'accueil

// Récupération des données via l'API
fetch("http://localhost:3000/api/products")
    .then(data => data.json())
    .then(jsonListProduit => {
        let hrefBase = "./product.html?id=";   
        // Création des articles de la page d'accueil
        for(let article of jsonListProduit){
            document.querySelector(".items").innerHTML += 
                `<a href="./product.html?id=${article._id}">
                    <article>
                    <img src="${article.imageUrl}" alt="${article.altTxt}">
                    <h3 class="productName">${article.name}</h3>
                    <p class="productDescription">Description: ${article.description}</p>
                    </article>
                </a>`; 
 
            let hrefNew = new URL(`http://127.0.0.1:5500/P5-Dev-Web-Kanap/front/html/product.html?id=${article._id}`); 
        }
    }); 




