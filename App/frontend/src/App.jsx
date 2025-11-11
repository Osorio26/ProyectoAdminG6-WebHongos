import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FungusList from "./pages/FungusList";
import AddFungus from "./pages/AddFungus";
import MainLayout from "./components/MainLayout";
import FungusDetails from "./pages/FungusDetails"

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<FungusList />} />
          <Route path="/inventario" element={<FungusList />} />
          <Route path="/agregar" element={<AddFungus />} />
          <Route path="/detalle/:code" element={<FungusDetails />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
