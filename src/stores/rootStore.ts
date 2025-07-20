
import { makeAutoObservable } from "mobx";
import { LoginStore } from "./loginStore";
import { ChatStore } from "./chatStore";
import { ChatListStore } from "./chatListStore";
import { ChatWindowStore } from "./chatWindowStore";
import { UserSelectorStore } from "./userSelectorStore";

export class RootStore {
    loginStore: LoginStore;
    chatStore: ChatStore;
    chatListStore: ChatListStore;
    chatWindowStore: ChatWindowStore;
    userSelectorStore: UserSelectorStore;
    
    
    constructor() {
        this.loginStore = new LoginStore(this);
        this.chatStore = new ChatStore();
        this.chatListStore = new ChatListStore();
        this.chatWindowStore = new ChatWindowStore();
        this.userSelectorStore = new UserSelectorStore();
        makeAutoObservable(this);
    }
}
