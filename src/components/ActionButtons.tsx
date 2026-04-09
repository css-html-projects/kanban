import styles from "./ActionButtons.module.css";

type Props = {
    isVisible: boolean;
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
};

export default function ActionButtons({ isVisible, onEdit, onDelete, className }: Props) {
    if (!isVisible) return null;

    return (
        <div className={`${styles.actions} ${className || ""}`}>
            <button className={styles.btn} onClick={onEdit}>
                <i className="fa-solid fa-pen"></i>
            </button>
            <button className={`${styles.btn} ${styles.delete}`} onClick={onDelete}>
                <i className="fa-solid fa-circle-minus"></i>
            </button>
        </div>
    );
}