export type Task = {
    id: string;
    title: string;
    priority: 1 | 2 | 3 | 4 | 5;

}

export type Column = {
    id: string;
    title: string;
    taskIds: string[];
}

export type Board = {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];

}