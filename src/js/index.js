import Search from "./classes/Search.js";
export default class App {
    constructor() {
        this.search = new Search();
    }
}

export const init = new App();