import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/LoginView";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
