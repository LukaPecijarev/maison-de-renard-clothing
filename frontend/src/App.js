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
import ProductDetailsPage from './pages/ProductDetailsPage';

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
            </Routes>
          </Layout>
          <ChatBot />
        </Router>
      </AuthProvider>
  );
}

export default App;