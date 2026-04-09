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
            const newTasks = { ...prev.tasks };
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

    return (
        <>
            <h2 className={styles.boardTitle}> My board</h2>
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
        </>
    );
}