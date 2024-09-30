document.addEventListener('DOMContentLoaded', function () {
    const recipeContainer = document.getElementById('recipes');
    const searchBtn = document.getElementById('search-btn');
    const searchBox = document.getElementById('search-box');

    // Add event listener to the search button
    searchBtn.addEventListener('click', () => {
        const query = searchBox.value.trim();
        if (query !== '') {
            fetchRecipes(query);
        } else {
            alert("Please enter a search term");
        }
    });
    async function fetchRecipes(query) {
        const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

        try {
            const response = await fetch(apiURL);  
            const data = await response.json();    
            if (data.meals) {
                displayRecipes(data.meals);    
            } else {
                recipeContainer.innerHTML = `<p>No recipes found for "${query}". Try another search.</p>`;
            }
        } catch (error) {
            console.error('Error fetching data from the API:', error); 
            recipeContainer.innerHTML = `<p>There was an error fetching the recipes. Please try again later.</p>`;
        }
    }
    async function fetchAllRecipes() {
        const vegApiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian`;
        const nonVegApiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood`;

        try {
            const vegResponse = await fetch(vegApiURL);
            const nonVegResponse = await fetch(nonVegApiURL);
            const vegData = await vegResponse.json();
            const nonVegData = await nonVegResponse.json();

            const allRecipes = [...vegData.meals, ...nonVegData.meals];
            displayRecipes(allRecipes);
        } catch (error) {
            console.error('Error fetching data from the API:', error);
            recipeContainer.innerHTML = `<p>There was an error fetching the recipes. Please try again later.</p>`;
        }
    }
    function displayRecipes(recipes) {
        recipeContainer.innerHTML = ''; 

        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');
            recipeElement.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image">
                <h2 class="recipe-title">${recipe.strMeal}</h2>
                <div class="recipe-details" style="display: none;">
                    <p><strong>Recipe ID:</strong> ${recipe.idMeal}</p>
                    <p><strong>Category:</strong> ${recipe.strCategory}</p>
                    <p><strong>Origin:</strong> ${recipe.strArea}</p>
                    <h3>Ingredients:</h3>
                    <ul>${getIngredients(recipe).map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
                    <h3>Instructions:</h3>
                    <p>${recipe.strInstructions}</p>
                </div>
            `;
            const recipeTitle = recipeElement.querySelector('.recipe-title');
            const recipeImage = recipeElement.querySelector('.recipe-image');
            const toggleDetails = () => {
                const details = recipeElement.querySelector('.recipe-details');
                details.style.display = details.style.display === 'none' ? 'block' : 'none'; // Toggle display
            };

            recipeTitle.addEventListener('click', toggleDetails);
            recipeImage.addEventListener('click', toggleDetails);
            recipeContainer.appendChild(recipeElement);
        });
    }
    function getIngredients(recipe) {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(`${ingredient} - ${measure}`);
            }
        }
        return ingredients;
    }
    fetchAllRecipes();
});
