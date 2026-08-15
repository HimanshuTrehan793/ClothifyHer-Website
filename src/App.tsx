import { BrowserRouter, Routes, Route } from "react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AuthSync } from "@/features/auth/AuthSync";
import { LoginDialog } from "@/components/dialog/LoginDialog";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import Home from "@/pages/Home/Home";
import Cart from "@/pages/Cart/Cart";
import Wishlist from "@/pages/Wishlist/Wishlist";
import ProductDetail from "@/pages/ProductDetail/ProductDetail";
import AllCategories from "@/pages/Categories/AllCategories";
import CategoryListing from "@/pages/Categories/CategoryListing";
import Search from "@/pages/Search/Search";
import Profile from "@/pages/Profile/Profile";
import Orders from "@/pages/Orders/Orders";
import OrderDetail from "@/pages/Orders/OrderDetail/OrderDetail";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthSync />
      <MainLayout>
        {/* Inside the layout so a page error keeps the header and nav usable. */}
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<AllCategories />} />
            <Route
              path="/categories/:categorySlug"
              element={<CategoryListing />}
            />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
          </Routes>
        </ErrorBoundary>
      </MainLayout>

      {/* Mounted once, outside the routes — any screen can summon it. */}
      <LoginDialog />
    </BrowserRouter>
  );
}

export default App;
