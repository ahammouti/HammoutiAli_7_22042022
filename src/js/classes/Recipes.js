export default class Recipes {
    constructor(recipes) {
        this.displayRecipes(recipes)
        // this.createListIngredients(recipes)
        this.list = [];
    }

    createListIngredients(list) {
        list.forEach(element => {
            // console.log(element.ingredients);
            element.ingredients.forEach(ingr => {
                const wrapListIngredient = document.getElementsByClassName("js-wrapListIngredient")[0];

                let li = document.createElement("li");
                li.innerHTML = ` 
                        <div>${ingr.ingredient} :  <span>${ingr.quantity ? ingr.quantity : ""} ${ingr.unit ? ingr.unit : ""}</span> </div>
                `;
                wrapListIngredient.appendChild(li);
            });
        });
    }
    // createListIngredients(list) {
    //     const wrapListIngredient = document.getElementsByClassName("js-wrapListIngredient")[0];
    //     list.map(ingr => {
    //         console.log(ingr);
    //         const li = document.createElement('li');
    //         li.innerHTML = `<div>${ingr.ingredients.ingredient} : <span>${ingr.ingredients.quantity ? ingr.quantity : ""} ${ingr.unit ? ingr.unit : ""}</span> </div>`

    //         wrapListIngredient.appendChild(li)
    //     });

    // }

    displayRecipes(arrayRecipes) {
        const galleryRecipes = document.getElementsByClassName("js-galleryRecipes")[0];
        galleryRecipes.innerHTML = "";
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
            // console.log("item: ", item);
            for (const element of item.ingredients) {

                // console.log("element :", element);
                let li = document.createElement("li");
                li.innerHTML = ` 
                <div>${element.ingredient} <span>${element.quantity ? ": " + element.quantity : ""} ${element.unit ? element.unit : ""}</span> </div>
                `;
                wrapListIngredient.appendChild(li);
            }

            galleryRecipes.appendChild(cardRecipes);
        };
    }

};

{/* <article class="cardRecipes">
                <div class="cardRecipes__imgRecipe"></div>
                <div class="cardRecipes__overlayRecipe">
                    <div class="heading">
                        <h3 class="heading__title">Poisson Cru à la tahitienne</h3> <!-- ! dynamique -->
                        <span class="heading__timer">
                            <img src="./src/images/icons/timer.svg" alt="timer">
                            <small>60 min</small> <!-- ! dynamique -->
                        </span>
                    </div>
                    <div class="ingredientsAndDescription">
                        <div class="ingredientsAndDescription__ingr">
                            <ul>
                                <li>
                                    <div>Lait de coco : <span>400ml ddzdddzd dad</span> </div> <!-- ! dynamique -->
                                </li>
                                <li>
                                    <div>ingredient : <span>value</span> </div>
                                </li>
                                <li>
                                    <div>ingredient : <span>value</span> </div>
                                </li>
                            </ul>
                        </div>
                        <div class="ingredientsAndDescription__desc">
                            <!-- ! dynamique -->
                            <p>Découper le thon en dés, mettre dans un plat et recouvrir de jus de citron vert (mieux
                                vaut prendre un plat large et peu profond). Laisser reposer au réfrigérateur au moins 2
                                heures. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, quos!
                            </p>
                        </div>
                    </div>
                </div>
            </article> */}
