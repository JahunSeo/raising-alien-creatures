import React from "react";
import { BrowserRouter } from "react-router-dom";
import MultiAquarium from "./pages/MultiAquarium";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <MultiAquarium />
    </BrowserRouter>
  );
}

export default App;
