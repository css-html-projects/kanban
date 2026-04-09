import type { Board } from "./types";

const STORAGE_KEY = "kanbanBoard";

export function saveBoardToLocalStorage(board: Board) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    } catch (err) {
        console.error("Error saving board to localStorage:", err);
    }
}

export function loadBoardFromLocalStorage(): Board | null {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        return JSON.parse(data) as Board;
    } catch (err) {
        console.error("Error loading board from localStorage:", err);
        return null;
    }
}