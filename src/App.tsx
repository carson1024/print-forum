import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "layouts";

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
};

export default App;
