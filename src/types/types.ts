import { FirebaseApp } from "firebase/app";

export type ITodo = {
    id: number,
    title: string,
    complete: boolean
}

export type addTodo = {
    firebase: FirebaseApp;
}

export type toDos = {
    firebase: FirebaseApp;
    sort: string;
}

export type IButton = {
    name: string,
    action: string
}

export type footerProps = {
    sortAction: (sortAction: string) => void;
    sort: string;
}