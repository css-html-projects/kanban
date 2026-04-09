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
    selectedTaskId: string | null;
    setSelectedTaskId: (id: string | null) => void;
    onDelete: (taskId: string, columnId: string) => void;

}


export default function Column({column, tasks, setBoard, setSelectedTaskId, selectedTaskId, onDelete}: Props) {

    const [isAdding, setIsAdding] = useState(false);
    const [editSelected, setEditSelected] = useState("")

    return (
        <>
            <div className={styles.column}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                {column.taskIds.map(taskId => {
                    const task = tasks[taskId]
                    return <>{editSelected !== taskId && <Task
                        key={task.id} task={task}
                        isSelected={selectedTaskId === task.id}
                        onSelect={() => setSelectedTaskId(task.id)}
                        onEdit={() => setEditSelected(taskId)}
                        onDelete={() => onDelete(task.id, column.id)}
                    />}
                    {editSelected === taskId && (  <AddTaskForm
                        columnId={column.id}
                        setBoard={setBoard}
                        setIsAdding={setIsAdding}
                        setIsEditing={setEditSelected}
                        task={task}
                        mode="edit"
                    />)
                    }</>
                })}

                {!isAdding && <button onClick={() => setIsAdding(true)} className={styles.btnAddTask}>+</button>}
                {isAdding &&
                    <AddTaskForm
                        columnId={column.id}
                        setBoard={setBoard}
                        setIsAdding={setIsAdding}
                        setIsEditing={setEditSelected}


                    />
                }
            </div>
        </>
    )
}

