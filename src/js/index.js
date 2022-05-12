import Recipes from "./classes/Recipes.js";
import Search from "./classes/Search.js";
import Tag from "./classes/Tag.js";
export default class App {
    constructor() {
        this.search = new Search();
        this.tag = new Tag();
    }
}

export const init = new App();