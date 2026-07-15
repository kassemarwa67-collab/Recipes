


let recipes = document.querySelector("#recipes");
let search = document.querySelector("#search");

function getRecipes(url) {

    recipes.innerHTML = "";

    let request = new XMLHttpRequest();

    request.open("GET", url, true);

    request.onload = function () {

        if (request.readyState == 4 && request.status == 200) {

            let data = JSON.parse(request.responseText);

            dR(data.recipes);

        }

    };

    request.send();

}

function dR(arr) {

    arr.forEach(function (item) {

        recipes.innerHTML += `
            <div class="card">
                <img src="${item.image}" alt="${item.name}">
                <h2>${item.name}</h2>
                <p>${item.cuisine}</p>
                <p>${item.difficulty}</p>
                <p> ${item.rating}</p>
            </div>
        `;

    });

}

getRecipes("https://dummyjson.com/recipes");

search.addEventListener("input", () => {

    let value = search.value;

    let link = `https://dummyjson.com/recipes/search?q=${value}`;

    getRecipes(link);

});