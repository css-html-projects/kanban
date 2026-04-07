import styles from "./Task.module.css";
import type {Task} from "../types.ts";

type Props = {
    task: Task;
}
export default function Task({task}: Props) {
    return (
        <>
            <div className={styles.task}>
                <p className={styles.priority}> {task.priority} </p>
                <h3 className={styles.title}> {task.title} </h3>
            </div>
        </>
    )
}