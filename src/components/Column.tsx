import styles from "./Column.module.css";
import Task from "./Task.tsx";
import type {Board, Column, Task as TaskType} from "../types.ts";
import * as React from "react";
import {useState} from "react";
import {AddTaskForm} from "./AddTaskForm.tsx";

type Props = {
    column: Column;
    tasks: Record<string, TaskType>;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
}



export default function Column({column, tasks, setBoard}: Props) {

    const [isAdding, setIsAdding] = useState(false);

    return (
        <>
            <div className={styles.column}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                {column.taskIds.map(taskId => {
                    const task = tasks[taskId];
                    return <Task key={task.id} task={task}/>;
                })}

                {!isAdding && <button onClick={() => setIsAdding(true)} className={styles.btnAddTask}>+</button>}
                {isAdding &&
                    <AddTaskForm
                        columnId={column.id}
                        setBoard={setBoard}
                        setIsAdding={setIsAdding}
                    />
                   }
            </div>
        </>
    )
}

