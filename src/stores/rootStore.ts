
import { makeAutoObservable } from "mobx";
import { LoginStore } from "./loginStore";

export class RootStore {
    loginStore: LoginStore;
    constructor() {
        this.loginStore = new LoginStore();
        makeAutoObservable(this);
    }

}
