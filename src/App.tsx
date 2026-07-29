import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <main className="flex h-full flex-col items-center justify-center gap-2">
              <h1 className="text-2xl font-semibold">ClothifyHer</h1>
              <p className="text-muted-foreground text-sm">
                Add your routes in src/App.tsx
              </p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
