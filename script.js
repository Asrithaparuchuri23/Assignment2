const recipeContainer = document.getElementById('recipeContainer');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('search');

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    fetchRecipes(query);
});

async function fetchRecipes(query) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`); // Corrected backticks
    let data = await response.json();
    displayRecipes(data.meals);
}

function displayRecipes(recipes) {
    recipeContainer.innerHTML = ''; 
    if (recipes) {
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <h2>${recipe.strMeal}</h2>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <div>
                <p><strong>Category:</strong> ${recipe.strCategory}</p>
                </div>
                <p><strong>Instructions:</strong> ${recipe.strInstructions.substring(0, 100)}...</p>
                <button class="viewRecipeButton" data-recipe-id="${recipe.idMeal}">View Recipe</button>
            `;
            recipeContainer.appendChild(recipeDiv);
        });
        const viewRecipeButtons = document.querySelectorAll('.viewRecipeButton');
        viewRecipeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const recipeId = event.target.getAttribute('data-recipe-id');
                fetchRecipeDetails(recipeId);
            });
        });
    } else {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
    }
}

async function fetchRecipeDetails(recipeId) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`); // Corrected backticks
    let data = await response.json();
    const recipe = data.meals[0];
    recipeContainer.innerHTML = `<div>
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
    </div>
    <div>
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
    </div>
    <div>
        <p><strong>Area:</strong><br> ${recipe.strArea}</p> <!-- Added <br> for new line -->
    </div>
    <div>
        <h3>Ingredients:</h3>
        <ul>
            ${getIngredients(recipe).map(ingredient => `<li>${ingredient}</li>`).join('')} <!-- Corrected this section -->
        </ul>
    </div>
    <div>
        <h3>Instructions:</h3>
        <p>${recipe.strInstructions}</p>
    </div>
    <button id="backButton">Back to Recipes</button>`;
    document.getElementById('backButton').addEventListener('click', () => {
        const query = searchInput.value;
        fetchRecipes(query);
    });
}

function getIngredients(recipe) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];  
        const measure = recipe[`strMeasure${i}`];        
        if (ingredient) {
            ingredients.push(`${measure} ${ingredient}`); 
        }
    }
    return ingredients;
}
