import { FirebaseApp } from "firebase/app";

export type ITodo = {
    id: number,
    title: string,
    complete: boolean,
    alarm: number
}

export type addTodo = {
    firebase: FirebaseApp;
}

export type toDos = {
    firebase: FirebaseApp;
    sort: string;
    smallScr: boolean;
}

export type IButton = {
    name: string,
    action: string
}

export type footerProps = {
    sortAction: (sortAction: string) => void;
    sort: string;
    smallScr: boolean;
}

export type loginProps = {
    firebase: FirebaseApp;
}