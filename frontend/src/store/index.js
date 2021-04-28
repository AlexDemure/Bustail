import { makeAutoObservable } from "mobx"

class Store {
    user = null
    driver = null

    client_applications = null
    driver_applications = null

    constructor() {
        makeAutoObservable(this)
    }
}

export default new Store()