export default class Recipes {
    constructor() {
        this.galleryRecipes = document.getElementsByClassName("js-galleryRecipes")[0];
    }

    displayRecipes(arrayRecipes) {
        this.galleryRecipes.innerHTML = "";
        for (const item of arrayRecipes) {
            const cardRecipes = document.createElement("article");
            cardRecipes.classList.add("cardRecipes");
            cardRecipes.innerHTML = `
                <div class="cardRecipes__imgRecipe"></div>
                <div class="cardRecipes__overlayRecipe">
                    <div class="heading">
                        <h3 class="heading__title">${item.name}</h3>
                        <span class="heading__timer">
                            <img src="./src/images/icons/timer.svg" alt="timer">
                            <small>${item.time} min</small>
                        </span>
                    </div>
                    <div class="ingredientsAndDescription">
                        <div class="ingredientsAndDescription__ingr">
                            <ul class="js-wrapListIngredient">
                            </ul>
                        </div>
                        <div class="ingredientsAndDescription__desc">
                            <p>${item.description}</p>
                        </div>
                    </div>
                </div>
            `;
            const wrapListIngredient = cardRecipes.getElementsByClassName("js-wrapListIngredient")[0];
            for (const element of item.ingredients) {
                let li = document.createElement("li");
                li.innerHTML = ` 
                    <div>${element.ingredient} <span>${element.quantity ? ": " + element.quantity : ""} ${element.unit ? element.unit : ""}</span> </div>
                `;
                wrapListIngredient.appendChild(li);
            }

            this.galleryRecipes.appendChild(cardRecipes);
        }
    }
}