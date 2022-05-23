import Recipes from "./Recipes.js";
export default class Search {
    constructor() {
        this.arrayAllDataRecipes = [];
        this.arrayIngredients = [];
        this.arrayAppliances = [];
        this.arrayUtensils = [];
        this.historySearch = [];

        this.searchInput = document.getElementsByClassName("js-inputSearchbar")[0];
        this.searchInputIngredient = document.getElementsByClassName("inputSearch-ingredients")[0];
        this.searchInputAppliances = document.getElementsByClassName("inputSearch-appliances")[0];
        this.searchInputUtensils = document.getElementsByClassName("inputSearch-utensils")[0];
        this.galleryRecipes = document.getElementsByClassName("js-galleryRecipes")[0];

        this.containerTags = document.getElementsByClassName("js-tags")[0];

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
        this.filterSearch = this.debounced((e, array) => this._filterSearch(e, array));
        this.filterSearchFilters = this.debounced((e, array, type) => this._filterSearchFilters(e, array, type));
    }

    debounced = (func, delay = 500) => {
        let timer = null;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, delay);
        }
    }

    attachEvent() {
        for (const btn of this.searchByTagBtnDiv) { this.searchByTagBtnDiv ? btn.addEventListener("click", this.openFilterList) : "" }

        this.searchInput.addEventListener("input", (e) => { this.filterSearch(e, this.arrayAllDataRecipes) });

        this.searchInputIngredient.addEventListener("input", (e) => { this.filterSearchFilters(e, this.arrayIngredients, "ingredients") })
        this.searchInputAppliances.addEventListener("input", (e) => { this.filterSearchFilters(e, this.arrayAppliances[0], "appliances") })
        this.searchInputUtensils.addEventListener("input", (e) => { this.filterSearchFilters(e, this.arrayUtensils[0], "utensils") })
    }

    async _getDataRecipes() {
        const response = await fetch("src/js/data/recipes.json");

        if (response.status === 200) {
            const result = await response.json();
            this.arrayAllDataRecipes = result.recipes;

            this.getIngredients(this.arrayAllDataRecipes);
            this.getAppliances();
            this.getUtensils();

            this.recipes = new Recipes();
            this.recipes.displayRecipes(this.arrayAllDataRecipes);
            this.displayTag(this.arrayAppliances, "appliances");
            this.displayTag(this.arrayUtensils, "utensils");
            this.displayTag([this.arrayIngredients], "ingredients");
        }
    }

    _filterSearch(e, array) {
        if (e.target.value.length > 2) {
            this.galleryRecipes.innerHTML = "";
            const searchedString = e.target.value.toLowerCase();
            const filteredArr = array.filter(el => {
                return (
                    el.name.toLowerCase().match(searchedString) ||
                    el.description.toLowerCase().match(searchedString) ||
                    el.ingredients.some(ingr => ingr.ingredient.toLowerCase().match(searchedString))
                );
            });
            this.recipes.displayRecipes(filteredArr);
            if (filteredArr == "") {
                const noRecipes = document.createElement("div");
                noRecipes.classList.add("noRecipes");
                noRecipes.textContent = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
                this.galleryRecipes.appendChild(noRecipes);
            }
        }
        else this.recipes.displayRecipes(array);
    }

    _filterSearchFilters(e, array, type) {
        this.containerFilter = document.getElementsByClassName("listTagBtn -" + type)[0];
        this.containerFilter.innerHTML = "";
        if (e.target.value.length > 0) {
            const searchedString = e.target.value.toLowerCase();
            const filteredArr = array.filter(el => el.toLowerCase().match(searchedString));
            this.displayFilter(filteredArr, type);
        }
        else this.displayFilter(array, type);
    }

    getIngredients(array) {
        array.forEach((element) => {
            element.ingredients.forEach((ingredient) => {
                !this.arrayIngredients.includes(ingredient.ingredient.toLowerCase().replace(".", "")) ?
                    this.arrayIngredients.push(ingredient.ingredient.toLowerCase().replace(".", "")) : "";
            });
        });
        this.arrayIngredients.sort();
        this.displayFilter(this.arrayIngredients, "ingredients");
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

    displayTag(tabl, type) {
        const tag = document.createElement("div");
        tag.classList.add("tags__itemTag");
        tag.classList.add("tags__itemTag--" + type);

        tabl.map((str, index) => {

            this.obj = {
                value: str,
                id: index
            }

            tag.innerHTML =
                `
                <p class="text-tag js-textTag">${this.obj.value[index]}</p>
                <button>
                    <img src="./src/images/icons/close-icon.svg" alt="supprimer">
                </button>
            `;
            console.log(this.obj.value);
        })
        console.log(tag);
        this.containerTags.appendChild(tag);
    }

    displayFilter(tabl, type) {
        this.containerFilter = document.getElementsByClassName("listTagBtn -" + type)[0];
        tabl.map(element => {
            const filterItem = document.createElement("li");
            filterItem.classList.add("js-filterItem");
            filterItem.setAttribute("tabindex", "0");
            filterItem.textContent = element;
            this.containerFilter.appendChild(filterItem);
        });
    };

    _openFilterList(e) {
        const divBtnList = document.getElementsByClassName("js-btnFilter");
        const bigBtnList = e.currentTarget;
        const itemTag = bigBtnList.parentElement.parentElement.getElementsByClassName("listTagBtn")[0];
        const arrowImg = bigBtnList;
        const isOpened = e.currentTarget.dataset.openedlist;
        const isclickedArrow = bigBtnList.dataset.isclicked;
        const isNotOpenClass = document.getElementsByClassName("wrap-arrow")[0];

        for (const btnFilter of divBtnList) {
            // console.log();
            btnFilter.setAttribute("data-isclicked", false)
            btnFilter.parentElement.parentElement.parentElement.classList.remove("showListTag");
            btnFilter.parentElement.parentElement.getElementsByClassName("listTagBtn")[0].classList.remove("showListTag");
        }

        bigBtnList.setAttribute("data-openedList", false);
        bigBtnList.parentElement.parentElement.parentElement.classList.remove("showListTag");
        itemTag.classList.remove("showListTag");

        if (isOpened == "false") {
            bigBtnList.classList.remove("isNotOpen");
            e.currentTarget.setAttribute("data-openedList", true);
            bigBtnList.parentElement.parentElement.parentElement.classList.add("showListTag");
            itemTag.classList.add("showListTag");

            for (const closeBtn of this.arrowListImg) {
                closeBtn.addEventListener("click", () => {
                    bigBtnList.classList.add("isNotOpen")
                    arrowImg.setAttribute("data-isclicked", true)
                });
            }
            arrowImg.setAttribute("data-isclicked", true);
        }
    }
}