import styles from "./Column.module.css";
import Task from "./Task.tsx";
import type { Board, Column, Task as TaskType } from "../types.ts";
import * as React from "react";
import { useState } from "react";
import { AddTaskForm } from "./AddTaskForm.tsx";
import ModalColumn from "./ModalColumn.tsx";

type Props = {
    column: Column;
    tasks: Record<string, TaskType>;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    selectedTaskId: string | null;
    setSelectedTaskId: (id: string | null) => void;
    onDelete: (taskId: string, columnId: string) => void;
    draggedTask: { taskId: string; fromColumnId: string } | null;
    setDraggedTask: React.Dispatch<
        React.SetStateAction<{ taskId: string; fromColumnId: string } | null>
    >;
};

export default function Column({
                                   column,
                                   tasks,
                                   setBoard,
                                   setSelectedTaskId,
                                   selectedTaskId,
                                   draggedTask,
                                   setDraggedTask,
                                   onDelete,
                               }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const [editSelected, setEditSelected] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ================= COLUMN ACTIONS =================
    function deleteColumn() {
        setBoard((prev) => {
            const newColumns = { ...prev.columns };
            delete newColumns[column.id];
            return {
                ...prev,
                columns: newColumns,
                columnOrder: prev.columnOrder.filter((id) => id !== column.id),
            };
        });
        setIsModalOpen(false);
    }

    function editColumn(newName: string) {
        if (!newName.trim()) return;
        setBoard((prev) => ({
            ...prev,
            columns: {
                ...prev.columns,
                [column.id]: {
                    ...prev.columns[column.id],
                    title: newName,
                },
            },
        }));
        setIsModalOpen(false);
    }


    // ================= DRAG LOGIC =================

    function handleDragOverTask(e: React.DragEvent, targetTaskId: string) {
        e.preventDefault();
        if (!draggedTask) return;

        const { taskId, fromColumnId } = draggedTask;
        if (taskId === targetTaskId) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const offset = e.clientY - rect.top;
        const insertAfter = offset > rect.height / 2;

        setBoard((prev) => {
            const sourceColumn = prev.columns[fromColumnId];
            const targetColumn = prev.columns[column.id];

            const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);

            const baseTaskIds = fromColumnId === column.id ? newSourceTaskIds : targetColumn.taskIds;
            const cleaned = baseTaskIds.filter((id) => id !== taskId);

            let targetIndex = cleaned.indexOf(targetTaskId);
            if (targetIndex === -1) return prev;
            if (insertAfter) targetIndex += 1;

            const newTaskIds = [...cleaned];
            newTaskIds.splice(targetIndex, 0, taskId);

            return {
                ...prev,
                columns: {
                    ...prev.columns,
                    [fromColumnId]: {
                        ...sourceColumn,
                        taskIds: fromColumnId === column.id ? newTaskIds : newSourceTaskIds,
                    },
                    [column.id]: {
                        ...targetColumn,
                        taskIds: newTaskIds,
                    },
                },
            };
        });
    }

    function handleDropOnColumn(e: React.DragEvent) {
        e.preventDefault();
        if (!draggedTask) return;

        const { taskId, fromColumnId } = draggedTask;
        const targetColumn = column;

        if (targetColumn.taskIds.length === 0) {
            setBoard((prev) => {
                const sourceColumn = prev.columns[fromColumnId];
                const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);

                return {
                    ...prev,
                    columns: {
                        ...prev.columns,
                        [fromColumnId]: {
                            ...sourceColumn,
                            taskIds: newSourceTaskIds,
                        },
                        [column.id]: {
                            ...targetColumn,
                            taskIds: [taskId],
                        },
                    },
                };
            });
        }

        setDraggedTask(null);
    }

    // ================= RENDER =================
    return (
        <div
            className={styles.column}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnColumn}
        >
            <div className={styles.columnTop}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
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

            {column.taskIds.map((taskId) => {
                const task = tasks[taskId];
                return (
                    <React.Fragment key={taskId}>
                        {editSelected !== taskId ? (
                            <Task
                                task={task}
                                isSelected={selectedTaskId === task.id}
                                onSelect={() => setSelectedTaskId(task.id)}
                                onEdit={() => setEditSelected(taskId)}
                                onDelete={() => onDelete(task.id, column.id)}
                                onDragStart={() =>
                                    setDraggedTask({ taskId, fromColumnId: column.id })
                                }
                                onDragOver={(e) => handleDragOverTask(e, task.id)}
                            />
                        ) : (
                            <AddTaskForm
                                columnId={column.id}
                                setBoard={setBoard}
                                setIsAdding={setIsAdding}
                                setIsEditing={setEditSelected}
                                task={task}
                                mode="edit"
                            />
                        )}
                    </React.Fragment>
                );
            })}

            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className={styles.btnAddTask}
                >
                    +
                </button>
            )}

            {isAdding && (
                <AddTaskForm
                    columnId={column.id}
                    setBoard={setBoard}
                    setIsAdding={setIsAdding}
                    setIsEditing={setEditSelected}
                />
            )}

            {isModalOpen && (

                    <ModalColumn
                        title="Edit Column"
                        initialValue={column.title}
                        onCancel={() => setIsModalOpen(false)}
                        onSave={editColumn}
                        onDelete={deleteColumn}
                    />
                )}

        </div>
    );
}