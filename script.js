// Get references to HTML elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const categoryDropdown = document.getElementById("category-dropdown");
const mealList = document.getElementById("meal-list");
const favoriteList = document.getElementById("favorite-list");

// Initialize favorites array from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Function to render meals
function renderMeals(meals) {
    mealList.innerHTML = "";
    meals.forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.classList.add("meal-card");
        mealCard.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <button data-meal="${meal.idMeal}" class="add-to-favorites">Add to Favorites</button>
        `;
        mealList.appendChild(mealCard);

        // Check if the meal is already a favorite
        if (favorites.includes(meal.idMeal)) {
            const favoriteButton = mealCard.querySelector(".add-to-favorites");
            favoriteButton.disabled = true;
            favoriteButton.textContent = "Added to Favorites";
        }

        // Add event listener to the "Add to Favorites" button
        mealCard.querySelector(".add-to-favorites").addEventListener("click", (event) => {
            const mealId = event.target.getAttribute("data-meal");
            if (!favorites.includes(mealId)) {
                favorites.push(mealId);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                event.target.disabled = true;
                event.target.textContent = "Added to Favorites";
                renderFavorites();
            }
        });
    });
}

// Function to render favorites
function renderFavorites() {
    favoriteList.innerHTML = "";
    favorites.forEach((mealId) => {
        // Fetch meal details by ID
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then((response) => response.json())
            .then((data) => {
                const meal = data.meals[0];
                if (meal) {
                    const favoriteCard = document.createElement("div");
                    favoriteCard.classList.add("favorite-card");
                    favoriteCard.innerHTML = `
                        <h3>${meal.strMeal}</h3>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <button data-meal="${meal.idMeal}" class="remove-from-favorites">Remove from Favorites</button>
                    `;
                    favoriteList.insertBefore(favoriteCard, favoriteList.firstChild);
                }
            });
    });
}

// Fetch categories for the dropdown
fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
    .then((response) => response.json())
    .then((data) => {
        const categories = data.meals;
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            categoryDropdown.appendChild(option);
        });
    });

// Event listener for the search button
searchButton.addEventListener("click", () => {
    const searchValue = searchInput.value.trim();
    const categoryValue = categoryDropdown.value;
    // Construct the API URL based on search and category
    let apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?";
    if (searchValue !== "") {
        apiUrl += `s=${searchValue}`;
    }
    if (categoryValue !== "") {
        apiUrl += `&c=${categoryValue}`;
    }
    // Fetch meals based on the URL
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const meals = data.meals;
            if (meals) {
                renderMeals(meals);
            } else {
                mealList.innerHTML = "<p>No meals found.</p>";
            }
        });
});

// Event listener for the search input (suggestion feature)
searchInput.addEventListener("input", debounce(handleSearch, 300));

// Debounce function to limit API requests while typing
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}

// Function to handle the search (suggestion feature)
function handleSearch() {
    const searchValue = searchInput.value.trim();

    // Check if the search query has at least 3 characters
    if (searchValue.length >= 3) {
        // Fetch meals based on the search query
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
            .then((response) => response.json())
            .then((data) => {
                const meals = data.meals;
                if (meals) {
                    renderMeals(meals);
                } else {
                    mealList.innerHTML = "<h1>No meals found.</h1>";
                }
            });
    } else {
        // Clear the meal list if the search query is less than 3 characters
        mealList.innerHTML = "";
    }
}

// Function to remove a meal from favorites
function removeFromFavorites(mealId) {
    const index = favorites.indexOf(mealId);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
    }
}

// Event listener for removing from favorites
document.getElementById("favorite-list").addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-favorites")) {
        const mealId = event.target.getAttribute("data-meal");
        removeFromFavorites(mealId);
    }
});

// Initial rendering of favorites
renderFavorites();
