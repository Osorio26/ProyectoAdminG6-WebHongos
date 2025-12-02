import { HashRouter as Router, Routes, Route } from "react-router-dom";
import FungusList from "./pages/FungusList";
import MainLayout from "./components/MainLayout";
import FungusDetails from "./pages/FungusDetails";
import EditFungus from "./pages/EditFungus";

import AddFungusMenu from './pages/AddFungusMenu';
import AddColecta from "./pages/addColectaPage";
import AddAislamiento from "./pages/AddAislamientoPage";
import AddHongo from "./pages/AddHongoPage";
import AddMorfologia from "./pages/AddMorfologiaPage";
import AddEnsayo from "./pages/AddEnsayoPage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>

          {/* RUTA PRINCIPAL: El menú */}
          <Route path="/add-menu" element={<AddFungusMenu />} />

          {/* HOME / INVENTARIO */}
          <Route path="/" element={<FungusList />} />
          <Route path="/inventario" element={<FungusList />} />

          {/* NUEVAS RUTAS "ADD" */}
          <Route path="/add-colecta" element={<AddColecta />} />
          <Route path="/add-aislamiento" element={<AddAislamiento />} />
          <Route path="/add-hongo" element={<AddHongo />} />
          <Route path="/add-morfologia" element={<AddMorfologia />} />  
          <Route path="/add-ensayo" element={<AddEnsayo />} />
          {/* DETALLES / EDICIÓN */}
          <Route path="/detalle/:code" element={<FungusDetails />} />
          <Route path="/editar/:code" element={<EditFungus />} />

        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
