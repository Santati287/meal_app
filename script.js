// Get references to HTML elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const mealList = document.getElementById("meal-list");
const favoriteList = document.getElementById("favorite-list");
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const modal = document.querySelector('.recipe-details');
let isModalOpen = false;

// Initialize favorites array from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Function to render meals
function renderMeals(meals, favouriteButtonDisabled = false) {
    mealList.innerHTML = "";
    meals.forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.classList.add("meal-card");
        mealCard.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>   
            <button data-meal="${meal.idMeal}" class="add-to-favorites">Add to Favorites</button>
            <button data-meal="${meal.idMeal}" class="view-recipe">View Recipe</button>
        `;
        /*const button = document.createElement('button');
        button.textContent ="View Recipe";
        mealCard.appendChild(button);
        button.addEventListener("click", () => {
            openRecipePopup(meal);
        });*/

        mealList.appendChild(mealCard);

        // Check if the meal is already a favorite
        if (favorites.includes(meal.idMeal)) {
            const favoriteButton = mealCard.querySelector(".add-to-favorites");

            if (!favouriteButtonDisabled) {
                favoriteButton.disabled = true;
            } else {
                favoriteButton.disabled = false;
            }

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

        // Add event listener to the "View Recipe" button
        mealCard.querySelector(".view-recipe").addEventListener("click", () => {
            openRecipePopup(meal);
        });
    });

    mealList.addEventListener("click", (event) => {
        if (event.target.classList.contains("view-recipe")) {
            const mealId = event.target.getAttribute("data-meal");
            const selectedMeal = { idMeal: mealId };
            openRecipePopup(selectedMeal);
        }
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
               console.log(data);
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

async function getMealById(mealId){
    // fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         const meal = data.meals[0];
    //         openRecipePopup(meal);
    // });
    try {
       const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
       const json = await response.json();
       const meal = json.meals[0];
       openRecipePopup(meal);
    } catch (error) {
        console.log(error);
    }
}
    
const openRecipePopup = (meal) => {
    if (!isModalOpen) {
        recipeDetailsContent.parentElement.style.display = "block";

        // Clear previous content
        recipeDetailsContent.innerHTML = `
            <h2 class= "recipePopUp">${meal.strMeal}</h2>
            <h3>Ingredents:</h3>
            <ul class= "ingredentList">${renderRecipeDetails(meal)}</ul>
            <div class="recipeInstructions">
                <h3> Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
        `; 

        isModalOpen = true;
    }
    
    

    //! Don't do this
    // Fetch meal details by ID
    // getMealById(meal.idMeal)
    //     .then((mealDetails) => {
    //         if (mealDetails) {
    //             renderRecipeDetails(mealDetails);
    //         }
    //     }).catch((err) => {
    //         console.log(err);
    //     });
        
};
    
// Function to render recipe details in the popup
const renderRecipeDetails = (meal) => {
    let ingredientsList = "";
    // Loop through ingredients
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strIngredient${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        } else {
            break;
        }
    }

    return ingredientsList;
};
//    recipeCloseBtn.addEventListener('click',()=>{
//     recipeDetailsContent.parentElement.style.display = "none";
//    });

function closeModal() {
    if (isModalOpen) {
        document.getElementById('model001').style.display = 'none';
        isModalOpen = false;
    }
} 

// Event listener for the search button
searchButton.addEventListener("click", () => {
     console.log("button clicked");
    
   // const searchValue = searchInput.value.trim();
    //handleSearch(searchValue);
 //   const categoryValue = categoryDropdown.value;
    // Construct the API URL based on search and category
   /* let apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php? ";
    if (searchValue !== null) {
        apiUrl += `s=${searchValue}`;
    
    /*if (categoryValue !== "") {
        apiUrl += `&c=${categoryValue}`;
    }
    */
    // Fetch meals based on the URL
    /*fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const meals = data.meals;
            if (meals) {
                renderMeals(meals);
            } else {
                mealList.innerHTML = "<h1>No meals found.</h1>";
            }
        });
    }*/
        
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
function handleSearch(favouriteButtonDisabled = false) {
    const searchValue = searchInput.value.trim();

    // Check if the search query has at least 3 characters
    if (searchValue.length >= 3) {
        // Fetch meals based on the search query
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
            .then((response) => response.json())
            .then((data) => {
                const meals = data.meals;
                if (meals) {
                    renderMeals(meals, favouriteButtonDisabled);
                } else {
                    mealList.innerHTML = "<h1>No meals found.</h1>";
                }
            });
            mealList.innerHTML = "";
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
        handleSearch(false);
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
 
