const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");
// const myRecipes = document.getElementById("my-recipes");
// const sharedRecipes = document.getElementById("shared-recipes");
const username = new URLSearchParams(window.location.search).get("username");


window.onload = async function() {
    await renderAllRecipes();
};

// if(myRecipes)
//     myRecipes.addEventListener('click', () => {
//         window.open(window.location, '_self');
//     });
//
// if(sharedRecipes)
//     sharedRecipes.addEventListener('click', () => {
//         window.open('./sharedRecipes.html?username='+username, '_self');
//     });

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

function renderRecipes(recipes, listItem){
    recipes.forEach((recipe) => {
        let li = document.createElement('li');
        let recipeName = document.createElement('span');
        // let city = document.createElement('span');
        let recipeId = recipe.data().category + '-' + recipe.data().name;
        li.setAttribute('id', recipeId);
        recipeName.textContent = recipe.data().name;
        // city.textContent = recipe.data().city;
        recipeName.addEventListener('click', displayRecipe.bind(recipeId, recipe.data()));
        li.appendChild(recipeName);
        // li.appendChild(city);

        listItem.appendChild(li);
    })
}

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

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

const newRecipeSubmit = document.querySelector("#newRecipe");

if(newRecipeSubmit)
    newRecipeSubmit.addEventListener('click', async (e) => {
        const category = document.getElementById('category').value;
        const recipeName = document.getElementById('newRecipeName').value;
        const ingredients = document.getElementById('newIngredients').value;
        const instructions = document.getElementById('newInstructions').value;
        e.preventDefault();
        await addRecipe(category, recipeName, ingredients, instructions);
        document.getElementById('category').value = '';
        document.getElementById('newRecipeName').value = '';
        document.getElementById('newIngredients').value = '';
        document.getElementById('newInstructions').value = '';
        location.reload();
        alert("Successfully added recipe");
    });

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

if(trigger)
    trigger.addEventListener("click", toggleModal);
if(closeButton)
    closeButton.addEventListener("click", toggleModal);
if(window)
    window.addEventListener("click", windowOnClick); 
