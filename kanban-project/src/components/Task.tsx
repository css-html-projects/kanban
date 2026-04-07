import styles from "./Task.module.css";
import type {Task} from "../types.ts";

type Props = {
    task: Task;
}
export default function Task({task}: Props) {

    const priorityClassMap = {
        1: styles.one,
        2: styles.two,
        3: styles.three,
        4: styles.four,
        5: styles.five,
    };

    return (
        <>
            <div className={styles.task}>
                <p className={` ${styles.priority} ${priorityClassMap[task.priority as 1 | 2 | 3 | 4 | 5]}`}> {task.priority} </p>
                <h3 className={styles.title}> {task.title} </h3>
            </div>
        </>
    )
}