const recipesContainer = document.querySelector("#recipes");
const searchInput = document.querySelector("#search");

// Fetch data safely using async / await
async function getRecipes(url) {
    try {
        recipesContainer.innerHTML = `<div class="loading">Loading recipes... ⏳</div>`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Server responded with an error");
        }

        const data = await response.json();
        displayRecipes(data.recipes);

    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipesContainer.innerHTML = `<div class="error">Oops! Something went wrong while loading recipes.</div>`;
    }
}

// Render recipe cards in the DOM
function displayRecipes(recipesList) {
    if (!recipesList || recipesList.length === 0) {
        recipesContainer.innerHTML = `<div class="no-results">No recipes found matching your search 🔍</div>`;
        return;
    }

    // Combine HTML strings for performance optimization
    const cardsHTML = recipesList.map(item => {
        const topIngredients = item.ingredients.slice(0, 3).join(", ") + (item.ingredients.length > 3 ? "..." : "");

        return `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <span class="badge-tag">${item.cuisine}</span>
                </div>
                <div class="card-body">
                    <h2>${item.name}</h2>
                    <div class="meta-info">
                        <span>⏱️ ${item.prepTimeMinutes + item.cookTimeMinutes} mins</span>
                        <span>📊 ${item.difficulty}</span>
                        <span>⭐ ${item.rating}</span>
                    </div>
                    <p class="ingredients"><strong>Ingredients:</strong> ${topIngredients}</p>
                </div>
            </div>
        `;
    }).join("");

    recipesContainer.innerHTML = cardsHTML;
}

// Debounce function to limit fast network calls during search input
function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

// Search Handler
const handleSearch = debounce((e) => {
    const value = e.target.value.trim();
    const link = value 
        ? `https://dummyjson.com/recipes/search?q=${value}`
        : "https://dummyjson.com/recipes";

    getRecipes(link);
}, 300);

// Attach event listener
searchInput.addEventListener("input", handleSearch);

// Initial Load
getRecipes("https://dummyjson.com/recipes");