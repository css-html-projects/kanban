import styles from "./Column.module.css";
import Task from "./Task.tsx";
import type {Board, Column, Task as TaskType} from "../types.ts";
import * as React from "react";
import {useState} from "react";
import {AddTaskForm} from "./AddTaskForm.tsx";


type Props = {
    column: Column,
    tasks: Record<string, TaskType>,
    setBoard: React.Dispatch<React.SetStateAction<Board>>,
    selectedTaskId: string | null,
    setSelectedTaskId: (id: string | null) => void,

    onDelete: (taskId: string, columnId: string) => void,


}


export default function Column({
                                   column,
                                   tasks,
                                   setBoard,
                                   setSelectedTaskId,
                                   selectedTaskId,

                                   onDelete,

                               }: Props) {

    const [isAdding, setIsAdding] = useState(false);
    const [editSelected, setEditSelected] = useState("")

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedColumnName, setEditedColumnName] = useState(column.title);

    function deleteColumn() {

        setBoard(prev => {
            const newColumns = {...prev.columns};
            delete newColumns[column.id];

            return {
                ...prev,
                columns: newColumns,
                columnOrder: prev.columnOrder.filter(id => id !== column.id),
            };
        });
        setIsModalOpen(false);
    }

    function editColumn() {
        if (!editedColumnName.trim()) return;
        setBoard(prev => ({
            ...prev,
            columns: {
                ...prev.columns,
                [column.id]: {
                    ...prev.columns[column.id],
                    title: editedColumnName
                }
            }
        }));
        setIsModalOpen(false);
    }

    return (
        <>
            <div className={styles.column}>
                <div className={styles.columnTop}>
                    <h2 className={styles.columnTitle}>
                        {column.title}

                    </h2>
                    <button
                        className={styles.btnSettings}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}
                    >
                        <i className="fa-solid fa-gear"></i>
                    </button>
                </div>

                {column.taskIds.map(taskId => {
                    const task = tasks[taskId]
                    return <>{editSelected !== taskId && <Task
                        key={task.id} task={task}
                        isSelected={selectedTaskId === task.id}
                        onSelect={() => setSelectedTaskId(task.id)}
                        onEdit={() => setEditSelected(taskId)}
                        onDelete={() => onDelete(task.id, column.id)}
                    />}
                        {editSelected === taskId && (<AddTaskForm
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

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3 className={styles.modalTitle}>Edit Column</h3>
                            <input
                                className={styles.input}
                                type="text"
                                value={editedColumnName}
                                onChange={(e) => setEditedColumnName(e.target.value)}
                                placeholder="Column name"
                            />
                            <div className={styles.modalButtons}>
                                <button
                                    className={styles.btnModal}
                                    onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>

                                <button
                                    className={styles.btnModal}
                                    onClick={editColumn}>
                                    Save
                                </button>
                            </div>

                            <button
                                className={`${styles.btnModal} ${styles.delete}`}
                                onClick={deleteColumn}>
                                Delete
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </>
    )


}

