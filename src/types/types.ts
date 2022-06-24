export type ITodo = {
    id: number,
    title: string,
    complete: boolean
}

export type addTodo = {
    addTodo: (toDoObj: ITodo) => void;
}

export type toDos = {
    todos: ITodo[] | null;
    completeTodo: (id: number) => void;
    removeTodo: (id: number) => void;
    editTodo: (id: number, value: string) => void;
}

export type IButton = {
    name: string,
    action: string
}

export type footerProps = {
    sortAction: (sortAction: string) => void;
    sort: string;
}