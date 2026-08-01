const recipesContainer = document.querySelector("#recipes");
const searchInput = document.querySelector("#search");

// Fetch data using async / await
async function getRecipes(url) {
    try {
        recipesContainer.innerHTML = `<div class="loading">Loading recipes... ⏳</div>`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from the server");
        }

        const data = await response.json();
        displayRecipes(data.recipes);

    } catch (error) {
        console.error("Error:", error);
        recipesContainer.innerHTML = `<div class="error">Oops! Something went wrong while loading recipes.</div>`;
    }
}

// Render cards in the DOM
function displayRecipes(recipesList) {
    if (!recipesList || recipesList.length === 0) {
        recipesContainer.innerHTML = `<div class="no-results">No recipes found matching your search 🔍</div>`;
        return;
    }

    // Combine all cards before inserting to optimize performance
    const cardsHTML = recipesList.map(item => {
        // Show only the first 3 ingredients
        const topIngredients = item.ingredients.slice(0, 3).join(", ") + (item.ingredients.length > 3 ? "..." : "");

        return `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="badge">${item.cuisine}</span>
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

// Debounce function to limit API requests during typing
function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

// Handle real-time search input
const handleSearch = debounce((e) => {
    const value = e.target.value.trim();
    const link = value 
        ? `https://dummyjson.com/recipes/search?q=${value}`
        : "https://dummyjson.com/recipes";

    getRecipes(link);
}, 300);

searchInput.addEventListener("input", handleSearch);

// Initial load
getRecipes("https://dummyjson.com/recipes");