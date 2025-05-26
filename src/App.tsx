import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { CalendarIndex } from "./components/calendar/CalendarIndex";
import { queryClient } from "./queryClient";
import { Toaster } from "sonner";
import { Button, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useCalendarStore } from "./calendarStore";

function App() {
  const { locale } = useCalendarStore();
  return (
    <ThemeProvider theme={theme}>
      <header>
        <SignedOut>
          <div className="flex flex-col w-screen h-screen items-center justify-center bg-gray-100">
            <div className="text-4xl font-bold text-gray-800 mb-4">
              Welcome 👋
            </div>
            <div className="text-lg text-gray-600 mb-6">
              Please sign in to access your calendar
            </div>
            <SignInButton>
              <Button
                size="large"
                variant="contained"
                className="px-6 py-3 rounded-lg shadow-md transition duration-200"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <QueryClientProvider client={queryClient}>
            <CalendarIndex key={locale} />
            <Toaster />
          </QueryClientProvider>
        </SignedIn>
      </header>
    </ThemeProvider>
  );
}

export default App;
