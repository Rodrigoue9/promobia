// comercial/App.tsx
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; //
import Footer from './components/Footer'; //
import HomePage from './pages/HomePage'; //
import CategoryPage from './pages/CategoryPage'; //
import ProductDetailPage from './pages/ProductDetailPage'; //
import AdminPage from './pages/AdminPage'; //
// REMOVA: import CartPage from './pages/CartPage';
// REMOVA: import { CartProvider } from './context/CartContext';
import CategoriesPage from './pages/CategoriesPage'; //

function App() {
  return (
    <HashRouter>
      {/* REMOVA: <CartProvider> */}
        <div className="flex flex-col min-h-screen text-slate-200">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* REMOVA: <Route path="/cart" element={<CartPage />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      {/* REMOVA: </CartProvider> */}
    </HashRouter>
  );
}

export default App;