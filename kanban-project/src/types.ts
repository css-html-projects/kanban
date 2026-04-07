export type Task = {
    id: string;
    title: string;
    priority: number;

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