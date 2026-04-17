import { Link, Route, Routes } from "react-router-dom";
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
  ["/story", "Story", StoryPage]
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-Color-3 text-ink">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/booth" element={<BoothPage />} />
          {figmaRoutes.map(([path, _label, Component]) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
