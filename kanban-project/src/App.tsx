import './App.css'
import {Board} from "./components/Board.tsx";
import { initialData } from "./initialData";

function App() {
    return <Board data={initialData} />;
}

export default App;
