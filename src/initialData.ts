import type { Board } from "./types";

export const initialData: Board = {
    tasks: {
        "task-1": {
            id: "task-1",
            title: "Learn HTML",
            priority: 1,
        },
        "task-2": {
            id: "task-2",
            title: "Learn CSS",
            priority: 2,
        },
        "task-3": {
            id: "task-3",
            title: "Learn JavaScript",
            priority: 3,
        },
        "task-4": {
            id: "task-4",
            title: "Learn React",
            priority: 4,
        },
    },

    columns: {
        "column-1": {
            id: "column-1",
            title: "To Do",
            taskIds: ["task-1", "task-2"],
        },
        "column-2": {
            id: "column-2",
            title: "In Progress",
            taskIds: ["task-3"],
        },
        "column-3": {
            id: "column-3",
            title: "Done",
            taskIds: ["task-4"],
        },
    },

    columnOrder: ["column-1", "column-2", "column-3"],
};