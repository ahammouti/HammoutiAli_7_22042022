export default class Search {
    constructor() {
        this.arrayAllDataRecipes = [];
        this.arrayIngredients = [];
        this.arrayAppliances = [];
        this.arrayUtensils = [];

        this.textTag = document.getElementsByClassName("js-textTag")[0];
        this.itemTag = document.getElementsByClassName("js-itemTag")[0];
        this.btnIngredient = document.getElementsByClassName("js-btnIngredients")[0];

        this.arrButtons = ["appliance", "ingredients", "utensils"];
        this.arrayButonsFiltered = [];
        this._getDataRecipes();
        this.bindEvent();
        this.attachEvent();
    }


    bindEvent() {
        console.log(this.btnIngredient);
        this.openFilterList = (e) => this._openFilterList(e);
    }
    attachEvent() {
        if (this.btnIngredient) {
            this.btnIngredient.addEventListener("click", this.openFilterList)
        }
    }

    _openFilterList(e) {
        console.log(e);
    }

    async _getDataRecipes() {
        const response = await fetch("src/js/data/recipes.json");

        if (response.status === 200) {
            const result = await response.json();
            this.arrayAllDataRecipes = result.recipes;

            this.getIngredients(this.arrayAllDataRecipes);
            this.getAppliances();
            this.getUtensils();
        }
    }

    getIngredients(array) {
        let item = [];
        array.forEach((element) => {
            element.ingredients.forEach((ingredient) => {
                if (
                    !item.includes(ingredient.ingredient.toLowerCase().replace(".", ""))
                ) {
                    item.push(ingredient.ingredient.toLowerCase().replace(".", ""));
                }
            });
        });
        item.sort();

        this.displayFilter(item, "ingredients");
    }

    filterArrayOfButtonsTags(arrayButtons, keyButons) {
        this.arrayAllDataRecipes.forEach(data => {
            arrayButtons.push(data[keyButons]);
            this.arrayButonsFiltered = [...new Set(arrayButtons)];
        });
        arrayButtons.splice(0, arrayButtons.length);
    }
    getAppliances() {
        this.filterArrayOfButtonsTags(this.arrayAppliances, this.arrButtons[0]);
        this.arrayAppliances.push(this.arrayButonsFiltered);
        this.displayFilter(this.arrayAppliances[0], "appliances");
    }

    getUtensils() {
        this.arrayAllDataRecipes.forEach(data => {
            this.arrayButonsFiltered = [...new Set(this.arrayUtensils)];
            data.ustensils.forEach(ust => {
                this.arrayUtensils.push(ust);
            });
        });
        this.arrayUtensils.push(this.arrayButonsFiltered);
        this.arrayUtensils.splice(0, this.arrayUtensils.length - 1);
        this.displayFilter(this.arrayUtensils[0], "utensils");
    }

    displayFilter(tabl, type) {
        console.log(`tab ${type} :`, tabl);
        const containerFilter = document.getElementsByClassName("listTagBtn -" + type)[0];
        console.log(containerFilter);
        tabl.map(element => {
            const filterItem = document.createElement("div");
            filterItem.classList.add("js-filterItem");
            filterItem.textContent = element;
            containerFilter.appendChild(filterItem);
        });
        // const tag = document.createElement("div");
        // tag.classList.add("tag");

        // tabl.map((str, index) => {

        //     this.obj = {
        //         value: str,
        //         id: index
        //     }

        //     tag.innerHTML =
        //         `
        //     <p class="text-tag js-textTag">${this.obj}</p>
        //         <button>
        //     <img src="./src/images/icons/close-icon.svg" alt="supprimer">
        //     </button>
        //     `;
        //     console.log([this.obj]);
        //     array.push
        // })
        // console.log(tag);
        // return containerTags.appendChild(tag);

    };

}