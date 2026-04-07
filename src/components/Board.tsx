import Column from "./Column.tsx";
import styles from "./Board.module.css";
import type {Board} from "../types.ts";
import {useState} from "react";

type Props = {
    data: Board;

}

export function Board({data}: Props) {

    const [board, setBoard] = useState<Board>(data);

    return (
        <>
            <h2 className={styles.boardTitle}> My board</h2>
            <div className={styles.board}>

                {board.columnOrder.map((columnId) => {

                    const column = board.columns[columnId];

                    return (
                        <Column
                            key={columnId}
                            column={column}
                            tasks={board.tasks}
                            setBoard={setBoard}
                        />
                    );
                })}
            </div>
        </>
    );
}