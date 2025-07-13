
import { makeAutoObservable } from "mobx";
import { LoginStore } from "./loginStore";
import { ChatStore } from "./chatStore";
import { ChatListStore } from "./chatListStore";
import { ChatWindowStore } from "./chatWindowStore";

export class RootStore {
    loginStore: LoginStore;
    chatStore: ChatStore;
    chatListStore: ChatListStore;
    chatWindowStore: ChatWindowStore;
    
    constructor() {
        this.loginStore = new LoginStore();
        this.chatStore = new ChatStore();
        this.chatListStore = new ChatListStore();
        this.chatWindowStore = new ChatWindowStore();
        makeAutoObservable(this);
    }
}
