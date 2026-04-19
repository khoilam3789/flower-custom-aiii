import { Link, Route, Routes, useLocation } from "react-router-dom";
import BoothPage from "./pages/BoothPage";
import AboutPage from "./pages/legacy/about-us";
import Blog1Page from "./pages/legacy/blog-1";
import Blog2Page from "./pages/legacy/blog-2";
import Blog3Page from "./pages/legacy/blog-3";
import Cart from "./pages/legacy/cart";
import FaqPage from "./pages/legacy/faq";
import Home from "./pages/legacy/home";
import Login from "./pages/legacy/login";
import Register from "./pages/legacy/register";
import Payment from "./pages/legacy/payment";
import PaymentSuccessPage from "./pages/legacy/payment-success";
import StoryPage from "./pages/legacy/story";
import BagGalleryPage from "./pages/legacy/bag-gallery";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AdminDashboard from "./pages/AdminDashboard";

import Customhoa from "./pages/legacy/custom-flowers";
import Customleaves from "./pages/legacy/custom-leaves";
import Custombags from "./pages/legacy/custom-bags";
import CustomPreview from "./pages/legacy/custom-preview";
import Customcards from "./pages/legacy/custom-cards";

const figmaRoutes = [
  ["/", "Home", Home],
  ["/about", "About Us", AboutPage],
  ["/blog-1", "Blog 1", Blog1Page],
  ["/blog-2", "Blog 2", Blog2Page],
  ["/blog-3", "Blog 3", Blog3Page],
  ["/cart", "Cart", Cart],
  ["/custom-flowers", "Custom Flowers", Customhoa],
  ["/custom-leaves", "Custom Leaves", Customleaves],
  ["/custom-bags", "Custom Bags", Custombags],
  ["/custom-preview", "AI Preview", CustomPreview],
  ["/custom-cards", "Custom Cards", Customcards],
  ["/faq", "FAQ", FaqPage],
  ["/login", "Login", Login],
  ["/register", "Register", Register],
  ["/payment", "Payment", Payment],
  ["/payment-success", "Payment Success", PaymentSuccessPage],
  ["/story", "Story", StoryPage],
  ["/bag-gallery", "Bag Gallery", BagGalleryPage]
];

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isBagGalleryRoute = location.pathname === "/bag-gallery";

  return (
    <div className={`min-h-screen flex flex-col font-sans text-ink ${isAdminRoute ? "bg-slate-100" : "bg-Color-3"}`}>
      {!isAdminRoute && !isBagGalleryRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/booth" element={<BoothPage />} />
          <Route path="/story/:slug" element={<StoryPage />} />
          {figmaRoutes.map(([path, _label, Component]) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </main>
      {!isAdminRoute && !isBagGalleryRoute && <Footer />}
    </div>
  );
}
