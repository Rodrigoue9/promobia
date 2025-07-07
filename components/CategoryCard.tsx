
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`} className="block group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
      <img src={category.image} alt={category.name} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-500 flex items-center justify-center">
        <h3 className="text-white text-3xl font-bold tracking-wider uppercase text-center p-4">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
