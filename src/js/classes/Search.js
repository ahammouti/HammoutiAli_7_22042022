import Recipes from "./Recipes.js";
export default class Search {
    constructor() {
        this.arrayAllDataRecipes = [];
        this.arrayIngredients = [];
        this.arrayAppliances = [];
        this.arrayUtensils = [];

        this.searchInput = document.getElementsByClassName("js-inputSearchbar")[0];
        this.textTag = document.getElementsByClassName("js-textTag")[0];
        this.itemTag = document.getElementsByClassName("js-itemTag")[0];
        this.searchByTagBtnDiv = document.getElementsByClassName("js-btnFilter");
        this.headerTagBtnDiv = document.getElementsByClassName("headerTagBtn");
        this.arrowListImg = document.getElementsByClassName("js-arrowList");
        this.menuOpened = true;


        this.arrButtons = ["appliance", "ingredients", "utensils"];
        this.arrayButonsFiltered = [];
        this._getDataRecipes();
        this.bindEvent();
        this.attachEvent();
    }

    bindEvent() {
        this.openFilterList = (e) => this._openFilterList(e);
        this.closeFilterList = (e) => this._closeFilterList(e);
    }

    handleDropDown = () => {
    }

    attachEvent() {
        for (const btn of this.searchByTagBtnDiv) { this.searchByTagBtnDiv ? btn.addEventListener("click", this.openFilterList) : "" }
        this.searchInput.addEventListener("input",)
    }

    async _getDataRecipes() {
        const response = await fetch("src/js/data/recipes.json");

        if (response.status === 200) {
            const result = await response.json();
            this.arrayAllDataRecipes = result.recipes;

            this.getIngredients(this.arrayAllDataRecipes);
            this.getAppliances();
            this.getUtensils();
            this.recipes = new Recipes(this.arrayAllDataRecipes);
        }
    }

    getIngredients(array) {
        let item = [];
        array.forEach((element) => {
            element.ingredients.forEach((ingredient) => {
                !item.includes(ingredient.ingredient.toLowerCase().replace(".", "")) ?
                    item.push(ingredient.ingredient.toLowerCase().replace(".", "")) : "";
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
            data.ustensils.forEach(ust => this.arrayUtensils.push(ust));
        });
        this.arrayUtensils.push(this.arrayButonsFiltered);
        this.arrayUtensils.splice(0, this.arrayUtensils.length - 1);
        this.displayFilter(this.arrayUtensils[0], "utensils");
    }

    displayFilter(tabl, type) {
        this.containerFilter = document.getElementsByClassName("listTagBtn -" + type)[0];
        tabl.map(element => {
            const filterItem = document.createElement("li");
            filterItem.classList.add("js-filterItem");
            filterItem.setAttribute("tabindex", "0")
            filterItem.textContent = element;
            this.containerFilter.appendChild(filterItem);
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

    _openFilterList(e) {
        const bigBtnList = e.currentTarget;
        const itemTag = bigBtnList.children[0].children[1];
        const arrowImg = e.currentTarget.children[0].children[0].children[2];
        const isOpened = e.currentTarget.dataset.openedlist;
        const isclickedArrow = e.currentTarget.children[0].children[0].children[2].dataset.isclicked;

        const bigBtnClass = bigBtnList.getAttribute("class", "showListTag");

        if (isOpened == "false") {
            e.currentTarget.setAttribute("data-openedList", true);
            bigBtnList.classList.add("showListTag");
            itemTag.classList.add("showListTag");

            if (this.arrowListImg) {
                for (const closeBtn of this.arrowListImg) {
                    closeBtn.addEventListener("click", () => {
                        arrowImg.setAttribute("data-isclicked", true)
                    });
                }
            }
            arrowImg.setAttribute("data-isclicked", false)
        }

        else if (isOpened == "true" && isclickedArrow == "true") {
            e.currentTarget.setAttribute("data-openedList", false);
            bigBtnList.classList.remove("showListTag");
            itemTag.classList.remove("showListTag");
        }
    }
}