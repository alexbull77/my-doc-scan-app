import "./App.css";
import { Scanner } from "./components/Scanner";

function App() {
  return (
    <div>
      <Scanner onScan={(img) => console.log(img)} />
    </div>
  );
}

export default App;
