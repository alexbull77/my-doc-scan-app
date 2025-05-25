import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { CalendarIndex } from "./components/calendar/CalendarIndex";
import { queryClient } from "./queryClient";
import { Toaster } from "sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CalendarIndex />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
