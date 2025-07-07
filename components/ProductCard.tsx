
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img src={product.image} alt={product.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
          {product.discountPercentage > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discountPercentage}% DE DESCONTO
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate" title={product.name}>{product.name}</h3>
          <p className="text-sm text-slate-400 mt-1 h-10">{product.description}</p>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              {product.discountPercentage > 0 && (
                <p className="text-sm text-red-500 line-through">
                  R${product.price.toFixed(2)}
                </p>
              )}
              <p className="text-xl font-bold text-white">
                R${discountedPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;