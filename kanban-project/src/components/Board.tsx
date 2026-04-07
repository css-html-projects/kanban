import Column from "./Column.tsx";
import styles from "./Board.module.css";
import type {Board} from "../types.ts";

type Props = {
    data: Board;

}

export function Board({data}: Props) {
    return (
        <>
            <h2 className={styles.boardTitle}> My board</h2>
            <div className={styles.board}>

                {data.columnOrder.map((columnId) => {

                    const column = data.columns[columnId];

                    return (
                        <Column
                            key={columnId}
                            column={column}
                            tasks={data.tasks}
                        />
                    );
                })}
            </div>
        </>
    );
}