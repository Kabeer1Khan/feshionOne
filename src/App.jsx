import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PlaceholderPage from "./pages/PlaceholderPage";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import CollectionsPage from "./pages/CollectionsPage";
import AboutPage from "./pages/AboutPage";
import SearchOverlay from "./components/SearchOverlay";
import WishlistPage from "./pages/WishlistPage";
import CartPage from './pages/CartPage'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <SearchOverlay />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
        <Route
          path="/account"
          element={<PlaceholderPage title="My Account" />}
        />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/reviews"
          element={<PlaceholderPage title="Customer Reviews" />}
        />
        <Route
          path="/privacy"
          element={<PlaceholderPage title="Privacy Policy" />}
        />
        <Route
          path="/terms"
          element={<PlaceholderPage title="Terms & Conditions" />}
        />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Routes>
      <Footer />
    </>
  );
}
