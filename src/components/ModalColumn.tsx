import { useState } from "react";
import styles from "./ModalColumn.module.css";

type Props = {
    title: string;
    initialValue: string;
    onCancel: () => void;
    onSave: (value: string) => void;
    onDelete?: () => void;
};

export default function ModalColumn({ title, initialValue, onCancel, onSave, onDelete }: Props) {
    const [value, setValue] = useState(initialValue);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3 className={styles.modalTitle}>{title}</h3>
                <input
                    className={styles.input}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Column name"
                />
                <div className={styles.modalButtons}>
                    <button className={styles.btnModal} onClick={onCancel}>Cancel</button>
                    <button className={styles.btnModal} onClick={() => onSave(value)}>Save</button>
                </div>
                {onDelete && (
                    <button className={`${styles.btnModal} ${styles.delete}`} onClick={onDelete}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}