import Recipes from "./Recipes.js";
export default class Search {
    constructor() {
        this.arrayAllDataRecipes = []; // tableau de toutes les recettes
        this.arrayIngredients = []; // tableau des ingredients non triés
        this.arrayIngredientsFiltered = []; // tableau des ingrédients triés 
        this.filterIngr = []; // copie du tableau des ingrédients triés
        this.filterIngrTags = [];

        this.arrayAppliances = []; // tableau des Appareils non triés
        this.arrayAppliancesFiltered = []; // tableau des Appareils triés
        this.filterApp = []; // copie du tableau des Appareils triés
        this.filterAppTags = [];

        this.arrayUtensils = []; // tableau des Ustensils non triés
        this.arrayUtensilsFiltered = []; // tableau des Ustensils triés
        this.filterUst = []; // copie du tableau des Ustensils triés
        this.filterUstTags = [];

        this.filterItem = []; // item dans les boutons de filtres
        this.historySearch = []; // tableau d'historique des recherches pour filtrer les resultats en fonction des éléments du tableau
        this.filterRecipes = []; // tableau des recettes filtrées
        this.historySearchbar = ""; // propriété qui sert a enregistrer le dernier mot tapé dans la searchbar
        this.historySearchbarFilters = "";

        this.searchInput = document.getElementsByClassName("js-inputSearchbar")[0];
        this.searchInputIngredient = document.getElementsByClassName("inputSearch-ingredients")[0];
        this.searchInputAppliances = document.getElementsByClassName("inputSearch-appliances")[0];
        this.searchInputUtensils = document.getElementsByClassName("inputSearch-utensils")[0];
        this.galleryRecipes = document.getElementsByClassName("js-galleryRecipes")[0]; // container des recettes

        this.containerTags = document.getElementsByClassName("js-tags")[0];
        this.tags = document.getElementsByClassName("listTagBtn");

        this.textTag = document.getElementsByClassName("js-textTag")[0];
        this.itemTag = document.getElementsByClassName("js-itemTag")[0];
        this.searchByTagBtnDiv = document.getElementsByClassName("js-btnFilter");
        this.headerTagBtnDiv = document.getElementsByClassName("headerTagBtn");
        this.arrowListImg = document.getElementsByClassName("js-arrowList");
        this.menuOpened = true;

        this.btnCloseTag = document.getElementsByClassName("js-btnClose");
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
        this.filterSearchFilters = this.debounced((e, type) => this._filterSearchFilters(e, type));
        this.getCurrentTagValue = (e) => this._getCurrentTagValue(e);
        this.searchByInput = this.debounced((e) => this._searchByInput(e), 1000);
        this.closingTag = (e, type) => this._closingTag(e, type);
    }

    debounced = (func, delay) => {
        let timer = null;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, delay);
        };
    };

    async attachEvent() {
        for (const btn of this.searchByTagBtnDiv) { this.searchByTagBtnDiv ? btn.addEventListener("click", this.openFilterList) : ""; }

        this.searchInputIngredient.addEventListener("input", (e) => { this.filterSearchFilters(e, "ingredients"); });
        this.searchInputAppliances.addEventListener("input", (e) => { this.filterSearchFilters(e, "appliances"); });
        this.searchInputUtensils.addEventListener("input", (e) => { this.filterSearchFilters(e, "utensils"); });

        for (const tag of this.tags) { tag.addEventListener("click", this.getCurrentTagValue); }
        this.searchInput.addEventListener("input", this.searchByInput);

        this.containerTags.addEventListener("click", (e) => {
            this.closingTag(e);
        });
    }

    async _getDataRecipes() {
        const response = await fetch("src/js/data/recipes.json");
        if (response.status === 200) {
            const result = await response.json();
            this.arrayAllDataRecipes = result.recipes;
            this.getIngredients(this.arrayAllDataRecipes);
            this.getAppliances();
            this.getUtensils();
            this.recipes = new Recipes(); // Instance de la classe Recipes
            this.recipes.displayRecipes(this.arrayAllDataRecipes);
        }
    }

    _searchByInput(e) {
        this.indexOfInputValue = this.historySearch.indexOf(e.target.value);
        if (e.target.value.length > 2) {
            this.filterSearch(e, this.arrayAllDataRecipes);
            if (e.target.value != this.historySearchbar) {
                this.historySearch.push("");
                this.historySearch.splice(this.historySearch.indexOf(this.historySearchbar));
                this.historySearchbar = e.target.value;
                this.getCurrentTagValue(e);
            }
            this.filterSearchFilters(e, "ingredients");
            this.historySearch.push(e.target.value);
        }

        if (e.target.value.length < 3) {
            if (e.target.value != this.historySearchbar) {
                this.historySearch.push("");
                this.historySearch.splice(this.historySearch.indexOf(this.historySearchbar));
                this.historySearchbar = e.target.value;
                this.getCurrentTagValue(e);
                this.filterSearch(e, this.arrayAllDataRecipes);
                this.filterSearchFilters(e, "ingredients");
                this.filterSearchFilters(e, "utensils");
                this.filterSearchFilters(e, "appliances");
            }
        }
    }

    _filterSearch(e, array) {
        this.galleryRecipes.innerHTML = "";

        this.filterSearchFilters(e, "ingredients");
        this.filterRecipes = [];
        if (this.filterRecipes.length < 1) {
            const noRecipes = document.createElement("div");
            noRecipes.classList.add("noRecipes");
            noRecipes.textContent = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
            this.galleryRecipes.appendChild(noRecipes);
        }

        for (let index = 0; index < array.length; index++) {
            const recipe = array[index];
            if (this.historySearch.map(tag => tag.toLowerCase()).every(r => recipe.name.toLowerCase().includes(r))) {
                if (!this.filterRecipes.includes(recipe)) {
                    this.filterRecipes.push(recipe);
                    this.recipes.displayRecipes(this.filterRecipes);
                }
                this.displayFilter(this.filterIngr, "ingredients");
            }

            if (this.historySearch.map(tag => tag.toLowerCase()).every(r => recipe.description.toLowerCase().includes(r))) {
                if (!this.filterRecipes.includes(recipe)) {
                    this.filterRecipes.push(recipe);
                    this.recipes.displayRecipes(this.filterRecipes);
                }
            }

            if (this.historySearch.map(tag => tag.toLowerCase()).every(r => recipe.name.toLowerCase().includes(r) || recipe.ingredients.map(ingr => ingr.ingredient.toLowerCase()).includes(r) || recipe.appliance.toLowerCase().includes(r) || recipe.ustensils.map(ustensil => ustensil.toLowerCase()).includes(r))) {
                if (!this.filterRecipes.includes(recipe)) {
                    this.filterRecipes.push(recipe);
                    this.recipes.displayRecipes(this.filterRecipes);
                }

                for (const ingr of recipe.ingredients) {
                    this.arrayIngredientsFiltered.push(ingr.ingredient.toLowerCase());
                    this.filterIngr = [...new Set(this.arrayIngredientsFiltered)];
                }

                for (const ust of recipe.ustensils) {
                    this.arrayUtensilsFiltered.push(ust.toLowerCase());
                    this.filterUst = [...new Set(this.arrayUtensilsFiltered)];
                }

                this.arrayAppliancesFiltered.push(recipe.appliance.toLowerCase());
                this.filterApp = [...new Set(this.arrayAppliancesFiltered)];

                for (const tag of this.tags) {
                    tag.innerHTML = "";
                }

                // affichage des filtres
                this.displayFilter(this.filterIngr, "ingredients");
                this.displayFilter(this.filterApp, "appliances");
                this.displayFilter(this.filterUst, "utensils");
            }

            if (this.historySearch.map(tag => tag.toLowerCase()).every(r => recipe.appliance.toLowerCase().includes(r))) {
                if (!this.filterRecipes.includes(recipe)) {
                    this.filterRecipes.push(recipe);
                    this.recipes.displayRecipes(this.filterRecipes);
                }
            }

            if (this.historySearch.map(tag => tag.toLowerCase()).every(r => recipe.ustensils.map(ustensil => ustensil.toLowerCase()).includes(r))) {
                if (!this.filterRecipes.includes(recipe)) {
                    this.filterRecipes.push(recipe);
                    this.recipes.displayRecipes(this.filterRecipes);
                }
            }
        }
    }

    deleteItemTagInFilterList() {
        if (this.historySearch.length > 0) {
            const tags = document.getElementsByClassName("js-filterItem");
            this.historySearch.forEach(el => {
                for (const tag of tags) {
                    if (tag.textContent == el) {
                        tag.remove();
                    }
                }
            });
        }
    }

    searchByInputFilters(e, prevArray, array, newArray, type) {
        this.containerFilter = document.getElementsByClassName("listTagBtn -" + type)[0];
        if (e.target.value.length > 0) {
            this.containerFilter.innerHTML = "";
            const searchedString = e.target.value.toLowerCase();
            array.forEach(el => {
                if (e.target.value != this.historySearchbarFilters) {
                    newArray.splice(newArray.indexOf(this.historySearchbarFilters, 1));
                    this.historySearchbarFilters = e.target.value;
                }
                if (el.includes(searchedString)) {
                    newArray.splice(newArray.indexOf(this.historySearchbarFilters, 1));
                    newArray.push(el);
                    this.displayFilter(newArray, type);
                }
            });
            this.deleteItemTagInFilterList();
            newArray.splice(newArray.indexOf(this.historySearchbarFilters, 1));
        }
        if (e.target.value.length == 0) {
            this.containerFilter.innerHTML = "";
            this.displayFilter(array, type);
            this.deleteItemTagInFilterList();
        }
        if (e.target.value.length <= 0 && this.historySearch.length == 0) {
            this.containerFilter.innerHTML = "";
            document.activeElement == document.getElementsByClassName("inputSearch-ingredients")[0] ? this.displayFilter(this.arrayIngredients, type) :
                document.activeElement == document.getElementsByClassName("inputSearch-utensils")[0] ? this.displayFilter(this.arrayUtensils, type) :
                    document.activeElement == document.getElementsByClassName("inputSearch-appliances")[0] ? this.displayFilter(this.arrayAppliances[0], type) : "";
        }

        if (e.target.value.length > 0 && this.historySearch.length == 0) {
            this.containerFilter.innerHTML = "";
            const searchedString = e.target.value.toLowerCase();
            const filteredArr = prevArray.filter(el => el.toLowerCase().match(searchedString));
            this.displayFilter(filteredArr, type);
        }
    }

    _filterSearchFilters(e, type) {
        this.deleteItemTagInFilterList();
        this.arrayIngredientsFiltered = this.arrayIngredients.filter(el => !el);
        this.arrayUtensilsFiltered = this.arrayUtensilsFiltered.filter(el => !el);
        this.arrayAppliancesFiltered = this.arrayAppliancesFiltered.filter(el => !el);
        document.activeElement == document.getElementsByClassName("inputSearch-ingredients")[0] ? this.searchByInputFilters(e, this.arrayIngredients, this.filterIngr, this.filterIngrTags, type) :
            document.activeElement == document.getElementsByClassName("inputSearch-utensils")[0] ? this.searchByInputFilters(e, this.arrayUtensils, this.filterUst, this.filterUstTags, type) :
                document.activeElement == document.getElementsByClassName("inputSearch-appliances")[0] ? this.searchByInputFilters(e, this.arrayAppliances[0], this.filterApp, this.filterAppTags, type) : "";

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
        this.arrayAllDataRecipes.forEach((element) => {
            element.ustensils.forEach((ust) => {
                !this.arrayUtensils.includes(ust.toLowerCase().replace(".", "")) ?
                    this.arrayUtensils.push(ust.toLowerCase().replace(".", "")) : "";
            });
        });
        this.arrayUtensils.sort();
        this.displayFilter(this.arrayUtensils, "utensils");
    }

    displayTag(e, type, value) {
        if (e.target && e.target.nodeName == "LI") {
            const tag = document.createElement("div");
            tag.classList.add("tags__itemTag");
            tag.classList.add("tags__itemTag--" + type);
            tag.innerHTML =
                `
                    <p class="text-tag js-textTag">${value}</p>
                    <button id="${value}" class="js-btnClose btnClosingTag-${type}">
                        <img src="./src/images/icons/close-icon.svg" alt="supprimer">
                    </button>
                `;
            this.containerTags.appendChild(tag);
        }
    }

    displayFilter(tabl, type) {
        this.containerFilter = document.getElementsByClassName("listTagBtn -" + type)[0];

        tabl.map(element => {
            this.filterItem = document.createElement("li");
            this.filterItem.classList.add("js-filterItem");
            this.filterItem.setAttribute("tabindex", "0");
            this.filterItem.setAttribute("data-type", type);
            this.filterItem.textContent = element;
            this.containerFilter.appendChild(this.filterItem);
        });
    }

    _openFilterList(e) {
        const divBtnList = document.getElementsByClassName("js-btnFilter");
        const bigBtnList = e.currentTarget;
        const itemTag = bigBtnList.parentElement.parentElement.getElementsByClassName("listTagBtn")[0];
        const arrowImg = bigBtnList;
        const isOpened = e.currentTarget.dataset.openedlist;

        for (const btnFilter of divBtnList) {
            btnFilter.setAttribute("data-isclicked", false);
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
                    bigBtnList.classList.add("isNotOpen");
                    arrowImg.setAttribute("data-isclicked", true);
                });
            }
            arrowImg.setAttribute("data-isclicked", true);
        }
    }

    _getCurrentTagValue(e) {
        if (e.target && e.target.nodeName == "LI") {
            const parentTagClicked = e.target.parentElement;
            const tagClicked = e.target.textContent.toLowerCase();
            parentTagClicked.previousElementSibling.firstChild.nextElementSibling.value = "";

            if (parentTagClicked.classList.contains("-ingredients")) {
                this.displayTag(e, "ingredients", tagClicked);
            }
            else if (parentTagClicked.classList.contains("-appliances")) {
                this.displayTag(e, "appliances", tagClicked);
            }
            else this.displayTag(e, "utensils", tagClicked);

            this.filterSearchFilters(e, "ingredients");
            this.filterSearchFilters(e, "appliances");
            this.filterSearchFilters(e, "utensils");

            this.filterSearch(e, this.arrayAllDataRecipes);
            this.historySearch.push(tagClicked);
            this.historySearch.push(tagClicked);
            this.deleteItemTagInFilterList();

            return this.historySearch;
        }
    }

    _closingTag(e) {
        const hideTag = e.target.parentElement;
        if (hideTag.nodeName == "BUTTON") {
            const newArr = this.historySearch.filter(el => el !== hideTag.getAttribute("id"));
            this.historySearch = newArr;
            this.filterSearch(e, this.arrayAllDataRecipes);
            this.filterSearchFilters(e, "ingredients");
            this.filterSearchFilters(e, "utensils");
            this.filterSearchFilters(e, "appliances");
            hideTag.parentElement.remove();
        }
    }
}