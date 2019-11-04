const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");
// looks into URL for username param
const username = new URLSearchParams(window.location.search).get("username");

// Onload means upon loading, this function should execute
window.onload = async function() {
    await renderAllRecipes();
};

// calling all recipes within all catagories from Firebase
async function renderAllRecipes() {
    let allRecipes = await retrieveAllRecipes();
    await renderBreakfast(allRecipes);
    await renderAppetizers(allRecipes);
    await renderSalads(allRecipes);
    await renderMDBeef(allRecipes);
    await renderMDChicken(allRecipes);
    await renderMDPork(allRecipes);
    await renderMDSeafood(allRecipes);
    await renderMDVegetarian(allRecipes);
    await renderBeverages(allRecipes);
    await renderDesserts(allRecipes);
}

async function renderBreakfast(recipes){
    let breakfastRecipes = recipes.docs.filter(recipe => recipe.data().category === 'breakfast');
    const breakfastList = document.querySelector("#breakfast");
    renderRecipes(breakfastRecipes, breakfastList);
}
async function renderAppetizers(recipes){
    let appetizerRecipes = recipes.docs.filter(recipe => recipe.data().category === 'appetizer');
    const appetizerList = document.querySelector("#appetizer");
    renderRecipes(appetizerRecipes, appetizerList);
}
async function renderSalads(recipes){
    let saladRecipes = recipes.docs.filter(recipe => recipe.data().category === 'salad');
    const saladList = document.querySelector("#salad");
    renderRecipes(saladRecipes, saladList);
}
async function renderMDBeef(recipes){
    let mdBeefRecipes = recipes.docs.filter(recipe => recipe.data().category === 'md-beef');
    const mdBeefList = document.querySelector("#md-beef");
    renderRecipes(mdBeefRecipes, mdBeefList);
}
async function renderMDChicken(recipes){
    let mdChickenRecipes = recipes.docs.filter(recipe => recipe.data().category === 'md-chicken');
    const mdChickenList = document.querySelector('#md-chicken');
    renderRecipes(mdChickenRecipes, mdChickenList);
}
async function renderMDPork(recipes){
    let mdPorkRecipes = recipes.docs.filter(recipe => recipe.data().category === 'md-pork');
    const mdPorkList = document.querySelector('#md-pork');
    renderRecipes(mdPorkRecipes, mdPorkList);
}
async function renderMDSeafood(recipes){
    let mdSeafoodRecipes = recipes.docs.filter(recipe => recipe.data().category === 'md-seafood');
    const mdSeafoodList = document.querySelector("#md-seafood");
    renderRecipes(mdSeafoodRecipes, mdSeafoodList);
}
async function renderMDVegetarian(recipes){
    let mdVegetarianRecipes = recipes.docs.filter(recipe => recipe.data().category === 'md-vegetarian');
    const mdVegetarianList = document.querySelector("#md-vegetarian");
    renderRecipes(mdVegetarianRecipes, mdVegetarianList);
}
async function renderBeverages(recipes){
    let beverageRecipes = recipes.docs.filter(recipe => recipe.data().category === 'beverage');
    const beveragetList = document.querySelector('#beverage');
    renderRecipes(beverageRecipes, beveragetList);
}
async function renderDesserts(recipes){
    let dessertRecipes = recipes.docs.filter(recipe => recipe.data().category === 'dessert');
    const dessertList = document.querySelector("#dessert");
    renderRecipes(dessertRecipes, dessertList);
}

async function retrieveAllRecipes() {
    return db.collection('users').doc(username)
        .collection('recipes').get();
}

// Adds all recipes of individual categories into the UL of that category
function renderRecipes(recipes, listItem){
    recipes.forEach((recipe) => {
        // creates li object
        let li = document.createElement('li');
        // creates the span
        let recipeName = document.createElement('span');
        // creates recipe ID which is a combo of category + name
        let recipeId = recipe.data().category + '-' + recipe.data().name;
        // setting the id for the LI item
        li.setAttribute('id', recipeId);
        // adding text content to recipe name tag/span
        recipeName.textContent = recipe.data().name;
        // Uses assigned recipe ID to pop up recipe when clicked
        recipeName.addEventListener('click', displayRecipe.bind(recipeId, recipe.data()));
        // appendChild adds child tag to the parent element tag
        li.appendChild(recipeName);

        listItem.appendChild(li);
    })
}

// Dynamically creating recipe display modal
function displayRecipe(recipeData) {
    const modalDiv = document.getElementById("recipe-modal");
    let title = document.createElement('h1');
    title.setAttribute('align', 'center')
    let ingredientsUL = document.createElement('ul');
    let instructionsUL = document.createElement('ul');
    let ingredientsLi = document.createElement('li');
    let instructionsLi = document.createElement('li');
    let ingredients = document.createElement('p');
    let instructions = document.createElement('p');
    title.textContent = recipeData.name;
    let ingredientHeading = document.createElement('h4');
    let instructionsHeading = document.createElement('h4');
    ingredientHeading.textContent = 'Ingredients';
    instructionsHeading.textContent = 'Cooking Directions';
    ingredients.textContent = recipeData.ingredients;
    instructions.textContent = recipeData.instructions;
    ingredientsUL.appendChild(ingredientHeading);
    ingredientsLi.appendChild(ingredients);
    instructionsUL.appendChild(instructionsHeading);
    instructionsLi.appendChild(instructions);
    ingredientsUL.appendChild(ingredientsLi);
    instructionsUL.appendChild(instructionsLi);
    modalDiv.appendChild(title);
    modalDiv.appendChild(ingredientsUL);
    modalDiv.appendChild(instructionsUL);
    document.getElementById('overlay').classList.add('is-visible');
    document.getElementById('recipe-modal').classList.add('is-visible');
}

// brings up/closes recipe display modal
function toggleModal() {
    modal.classList.toggle("show-modal");
}

// displays recipe modal until you click away from the modal
function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

// Assigning a variable to new recipe button
const newRecipeSubmit = document.querySelector("#newRecipe");

if(newRecipeSubmit)
// gets data user inputs into recipe input field
    newRecipeSubmit.addEventListener('click', async (e) => {
        const category = document.getElementById('category').value;
        const recipeName = document.getElementById('newRecipeName').value;
        const ingredients = document.getElementById('newIngredients').value;
        const instructions = document.getElementById('newInstructions').value;
        e.preventDefault();
        // awaiting adding new recipe to Firebase
        // after call to Firebase is complete and recipe is added, empties input fields
        await addRecipe(category, recipeName, ingredients, instructions);
        document.getElementById('category').value = '';
        document.getElementById('newRecipeName').value = '';
        document.getElementById('newIngredients').value = '';
        document.getElementById('newInstructions').value = '';
        // reload forces a refresh on page in order to show newly added recipes
        location.reload();
        alert("Successfully added recipe");
    });

    // Adds recipe by user to Firebase
function addRecipe(category, name, ingredients, instructions){
    return db.collection('users').doc(username).collection('recipes')
        .doc(name).set({category, name, instructions, ingredients}).then(() => true);
}

//Recipe modal handler
if(document.getElementById('btn-modal'))
    document.getElementById('btn-modal').addEventListener('click', function() {
        document.getElementById('overlay').classList.add('is-visible');
        document.getElementById('recipe-modal').classList.add('is-visible');
    });

if(document.getElementById('close-btn'))
    document.getElementById('close-btn').addEventListener('click', function() {
        clearModal();
    });

if(document.getElementById('overlay'))
    document.getElementById('overlay').addEventListener('click', function() {
        clearModal();
    });

function clearModal() {
    const modalDiv = document.getElementById("recipe-modal");
    modalDiv.textContent = '';
    document.getElementById('overlay').classList.remove('is-visible');
    document.getElementById('recipe-modal').classList.remove('is-visible');
}

// If conditions are added to safeguard creation of event listeners before elements are rendered
if(trigger)
    trigger.addEventListener("click", toggleModal);
if(closeButton)
    closeButton.addEventListener("click", toggleModal);
if(window)
    window.addEventListener("click", windowOnClick);
