import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts";
import Toastr from "components/toastr";

const App = () => {
  return (
    <>
      <Toastr />
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </>
  );
};

export default App;
