export default class Search {
    constructor() {
        this.arrayAllDataRecipes = [];
        this.arrayIngredients = [];
        this.arrayAppliances = [];
        this.arrayUtensils = [];

        this.arrButtons = ["appliance", "ingredients", "utensils"];
        this.arrayButonsFiltered = [];

        this.getDataRecipes();
    }

    async getDataRecipes() {
        const response = await fetch("src/js/data/recipes.json");

        if (response.status === 200) {
            const result = await response.json();
            this.arrayAllDataRecipes = result.recipes;
        }
        this.getIngredients();
        this.getAppliances();
        this.getUtensils();
    }

    filterArrayOfButtonsTags(arrayButtons, keyButons) {
        for (const data of this.arrayAllDataRecipes) {
            arrayButtons.push(data[keyButons]);
            this.arrayButonsFiltered = [...new Set(arrayButtons)];
        }
        arrayButtons.splice(0, 50);
    }

    getAppliances() {
        this.filterArrayOfButtonsTags(this.arrayAppliances, this.arrButtons[0])
        this.arrayAppliances.push(this.arrayButonsFiltered);
        console.log(this.arrayAppliances[0]);
        console.log("=========================");
    }

    getIngredients() {
        for (const data of this.arrayAllDataRecipes) {
            this.arrayIngredients.push(data["ingredients"][0].ingredient);
            this.arrayButonsFiltered = [...new Set(this.arrayIngredients)];
        }
        this.arrayIngredients.push(this.arrayButonsFiltered);
        this.arrayIngredients.splice(0, 50);
        this.arrayIngredients = this.arrayIngredients[0];
        console.log(this.arrayIngredients);
    }

    getUtensils() {
        for (const data of this.arrayAllDataRecipes) {
            this.arrayUtensils.push(data["ustensils"][0]);
            this.arrayButonsFiltered = [...new Set(this.arrayUtensils)];
        }
        this.arrayUtensils.push(this.arrayButonsFiltered);
        this.arrayUtensils.splice(0, 50);
        this.arrayUtensils = this.arrayUtensils[0];
        console.log(this.arrayUtensils);
    }
}