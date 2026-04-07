import * as React from "react";
import styles from "./AddTask.module.css";
import type {Board} from "../types.ts";


type Props = {
    columnId: string;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    setIsAdding: (value: boolean) => void;
};

export function AddTaskForm({columnId, setBoard, setIsAdding}: Props) {

    const formRef = React.useRef<HTMLFormElement | null>(null);

    const addTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const title = formData.get("title") as string;
        const priority = Number(formData.get("priority")) as 1 | 2 | 3 | 4 | 5 || 1;

        if (!title.trim()) {
            setIsAdding(false);
            return;
        }

        const id = crypto.randomUUID();

        const newTask = {
            id,
            title,
            priority,
        };

        setBoard(prev => {
            const currentColumn = prev.columns[columnId];

            return {
                ...prev,
                tasks: {
                    ...prev.tasks,
                    [id]: newTask,
                },
                columns: {
                    ...prev.columns,
                    [columnId]: {
                        ...currentColumn,
                        taskIds: [...currentColumn.taskIds, id],
                    },
                },
            };
        });

        setIsAdding(false);
        e.currentTarget.reset();
    };

    React.useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(e.target as Node)) {
                const form = formRef.current;
                const formData = new FormData(form);
                const title = (formData.get("title") as string).trim();

                if (title) {
                    form.requestSubmit();
                } else {
                    setIsAdding(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsAdding]);

    return (
        <form className={styles.addTask}
              onSubmit={addTask}
              ref={formRef}>

            <input type="text" name="title"
                   className={styles.inputTitle} placeholder="Add task..."/>

            <input type="number" name="priority" min="1" max="5"
                   className={styles.inputPriority}
                   placeholder="Priority"/>

            <button type="submit" style={{display: "none"}}/>

        </form>
    );
}
