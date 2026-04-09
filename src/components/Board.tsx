import Column from "./Column.tsx";
import styles from "./Board.module.css";
import type {Board} from "../types.ts";
import {useEffect, useRef, useState} from "react";
import { saveBoardToLocalStorage, loadBoardFromLocalStorage } from "../localStorage";
import ModalColumn from "./ModalColumn.tsx";

type Props = {
    data: Board;

}

export function Board({data}: Props) {


    const [board, setBoard] = useState<Board>(() => {

        const saved = loadBoardFromLocalStorage();
        return saved ?? data;
    });
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");
    const [draggedTask, setDraggedTask] = useState<{
        taskId: string;
        fromColumnId: string;
    } | null>(null);

    const taskContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        saveBoardToLocalStorage(board);
    }, [board]);


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

    function addColumn(name: string) {
        if (!name.trim()) return;

        const newId = `column-${Date.now()}`;
        const newColumn = {
            id: newId,
            title: name,
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
                            draggedTask={draggedTask}
                            setDraggedTask={setDraggedTask}
                        />

                    );
                })}
            </div>

            {isModalOpen && (
                <ModalColumn
                    title="Add new column"
                    initialValue={newColumnName}
                    onCancel={() => setIsModalOpen(false)}
                    onSave={(name) => {
                        addColumn(name);
                        setNewColumnName("");
                        setIsModalOpen(false);
                    }}
                />
            )}
        </>
    );
}