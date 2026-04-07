import styles from "./Column.module.css";
import Task from "./Task.tsx";
import type {Column} from "../types.ts";
import type { Task as TaskType } from "../types.ts";

type Props = {
    column: Column;
    tasks: Record<string, TaskType>;
}
export default function Column({ column, tasks }: Props) {
    return (
        <>
            <div className={styles.column}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                {column.taskIds.map(taskId=> {
                    const task = tasks[taskId];
                    return <Task key={task.id} task={task}/>;
                })}
            </div>
        </>
    )
}