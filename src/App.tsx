import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { CalendarIndex } from "./components/calendar/CalendarIndex";
import { queryClient } from "./queryClient";
import { Toaster } from "sonner";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CalendarIndex />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
