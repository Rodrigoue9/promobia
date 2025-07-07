// comercial/components/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, Wrench /* REMOVA: ShoppingCart */ } from 'lucide-react';
// REMOVA: import { useCart } from '../hooks/useCart';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // REMOVA: const { cartCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Buscando por:', searchQuery);
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = (
    <>
      <Link to="/" className="text-slate-300 hover:text-primary-400 transition-colors">Início</Link>
      <Link to="/categories" className="text-slate-300 hover:text-primary-400 transition-colors">Categorias</Link>
      <Link to="/category/2" className="text-slate-300 hover:text-primary-400 transition-colors">Vestuário</Link>
      <Link to="/category/3" className="text-slate-300 hover:text-primary-400 transition-colors">Casa e Lar</Link>
      <Link to="/admin" className="text-slate-300 hover:text-primary-400 transition-colors flex items-center gap-1">
        <Wrench size={16} /> Admin
      </Link>
    </>
  );

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" aria-label="E-Fusão Início">
              <img src="../img/logodevhq.png" alt="E-Fusão logo" className="h-10 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center space-x-6 ml-10">
              {navLinks}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-slate-800 rounded-full px-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="bg-transparent focus:outline-none text-sm py-2"
              />
              <button type="submit" className="text-slate-500 hover:text-primary-400">
                <Search size={18} />
              </button>
            </form>
            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                <User size={20} />
            </button>
            {/* REMOVA TODO ESTE BLOCO DO CARRINHO:
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-800 transition-colors" aria-label={`Carrinho de compras com ${cartCount} itens`}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-3">
              {navLinks}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;