import React, { useContext } from "react";
import { ThemeProvider } from "./hooks/ThemeContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ThemeProvider>
      <Header />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
