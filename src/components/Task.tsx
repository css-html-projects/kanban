import styles from "./Task.module.css";
import type {Task} from "../types.ts";
import ActionButtons from "./ActionButtons.tsx";

type Props = {
    task: Task;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}
export default function Task({task, isSelected, onSelect, onEdit, onDelete}: Props) {


    const priorityClassMap = {
        1: styles.one,
        2: styles.two,
        3: styles.three,
        4: styles.four,
        5: styles.five,
    };

    return (
        <>
            <div className={`${styles.task} ${isSelected && styles.selectedTask}`} onClick={onSelect} >
                <div className={styles.taskInfo}>
                <p className={` ${styles.priority} ${priorityClassMap[task.priority as 1 | 2 | 3 | 4 | 5]}`}> {task.priority} </p>
                    <h3 className={styles.title}> {task.title} </h3> </div>
                <ActionButtons isVisible={isSelected} onEdit={onEdit} onDelete={onDelete}/>




            </div>
        </>
    )
}