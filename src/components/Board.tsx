import Column from "./Column.tsx";
import styles from "./Board.module.css";
import type {Board} from "../types.ts";
import {useEffect, useRef, useState} from "react";

type Props = {
    data: Board;

}

export function Board({data}: Props) {


    const [board, setBoard] = useState<Board>(data);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");


    const taskContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (taskContainerRef.current && !taskContainerRef.current.contains(e.target as Node)) {
                setSelectedTaskId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function onDelete(taskId: string, columnId: string) {
        setBoard((prev) => {
            const newTasks = {...prev.tasks};
            delete newTasks[taskId];

            const column = prev.columns[columnId];

            const newColumn = {
                ...column,
                taskIds: column.taskIds.filter((id) => id !== taskId),
            };

            return {
                ...prev,
                tasks: newTasks,
                columns: {
                    ...prev.columns,
                    [columnId]: newColumn,
                },
            };
        });

        setSelectedTaskId(null);
    }

    function addColumn() {
        if (!newColumnName.trim()) return;

        const newId = `column-${Date.now()}`;
        const newColumn = {
            id: newId,
            title: newColumnName,
            taskIds: [],
        };

        setBoard((prev) => ({
            ...prev,
            columns: {
                ...prev.columns,
                [newId]: newColumn,
            },
            columnOrder: [...prev.columnOrder, newId],
        }));

        setNewColumnName("");
        setIsModalOpen(false);
    }

    return (
        <>
            <header className={styles.header}>
                <h2 className={styles.boardTitle}> My board</h2>
                <button className={styles.btn} onClick={() => setIsModalOpen(true)}>Add column</button>
            </header>
            <div className={styles.board} ref={taskContainerRef}>

                {board.columnOrder.map((columnId) => {

                    const column = board.columns[columnId];

                    return (
                        <Column
                            key={columnId}
                            column={column}
                            tasks={board.tasks}
                            setBoard={setBoard}
                            selectedTaskId={selectedTaskId}
                            setSelectedTaskId={setSelectedTaskId}
                            onDelete={onDelete}
                        />

                    );
                })}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Add new column</h3>
                        <input
                            className={styles.input}
                            type="text"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            placeholder="Column name"
                        />
                        <div className={styles.modalButtons}>
                            <button className={styles.btnModal} onClick={() => setIsModalOpen(false)}>Cancel</button>

                            <button className={styles.btnModal} onClick={() => addColumn()}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}