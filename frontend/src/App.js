import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import SpecialOffersPage from './pages/SpecialOffersPage';
import CheckoutPage from './pages/CheckoutPage';
import ChatBot from './components/ChatBot';
import CustomCursor from './components/CustomCursor';
import ProductDetailsPage from './pages/ProductDetailsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import CraftsmanshipPage from './pages/CraftsmanshipPage';
import SustainabilityPage from './pages/SustainabilityPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import ServicesPage from './pages/ServicesPage';
import ReturnsPage from './pages/ReturnsPage';
import ShippingPage from './pages/ShippingPage';
import CompliancePage from './pages/CompliancePage';
import LegalPage from './pages/LegalPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  return (
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/login" element={<LoginPage />} />
                <Route path="/products/add" element={<AddProductPage />} />
                <Route path="/products/:id/edit" element={<EditProductPage />} />
              <Route path="/special-offers" element={<SpecialOffersPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/cart" element={<CartPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </Layout>
          <ChatBot />
          <CustomCursor />
        </Router>
      </AuthProvider>
  );
}

export default App;
