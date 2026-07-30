import { BrowserRouter, Routes, Route } from "react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import Home from "@/pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout bagCount={3}>
              <Home />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
