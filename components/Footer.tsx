import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} Fusão E-Commerce. Todos os direitos reservados.</p>
        <p className="text-sm mt-1">Criado com React, Tailwind CSS e um toque de mágica.</p>
      </div>
    </footer>
  );
};

export default Footer;