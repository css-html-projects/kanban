import * as React from "react";
import styles from "./AddTask.module.css";
import type { Board, Task } from "../types.ts";

type Props = {
    columnId: string;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    setIsAdding: (value: boolean) => void;
    setIsEditing: (value: string) => void;
    mode?: "add" | "edit";
    task?: Task;
};

export function AddTaskForm({
                                columnId,
                                setBoard,
                                setIsAdding,
    setIsEditing,
                                mode = "add",
                                task
                            }: Props) {

    const formRef = React.useRef<HTMLFormElement | null>(null);

    const [title, setTitle] = React.useState(task?.title || "");
    const [priority, setPriority] = React.useState<1 | 2 | 3 | 4 | 5 | "">(
        task?.priority ?? ""
    );
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setIsAdding(false);
            setIsEditing('');
            return;
        }

        const finalPriority: 1 | 2 | 3 | 4 | 5 =
            priority === "" ? 1 : priority;

        if (mode === "edit" && task) {

            setBoard(prev => ({
                ...prev,
                tasks: {
                    ...prev.tasks,
                    [task.id]: {
                        ...prev.tasks[task.id],
                        title,
                        priority: finalPriority,
                    }
                }
            }));
        } else {

            const id = crypto.randomUUID();

            const newTask: Task = {
                id,
                title,
                priority: finalPriority,
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
        }

        setIsAdding(false);
        setIsEditing('');
    };

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(e.target as Node)) {

                if (title.trim()) {
                    formRef.current.requestSubmit();
                } else {
                    setIsAdding(false);
                    setIsEditing('');
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [title, setIsAdding, setIsEditing]);

    return (
        <form
            className={styles.addTask}
            onSubmit={handleSubmit}
            ref={formRef}
        >
            <input
                type="text"
                name="title"
                className={styles.inputTitle}
                placeholder="Add task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
            />

            <input
                type="number"
                name="priority"
                min="1"
                max="5"
                className={styles.inputPriority}
                placeholder="Priority"
                value={priority}
                onChange={(e) =>
                    setPriority(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                }
            />

            <button type="submit" style={{ display: "none" }} />
        </form>
    );
}