import "./App.css";
import { CalendarIndex } from "./components/calendar/CalendarIndex";
import { Scanner } from "./components/Scanner";

function App() {
  return (
    <div>
      <CalendarIndex />
      <Scanner onScan={(img) => console.log(img)} />
    </div>
  );
}

export default App;
