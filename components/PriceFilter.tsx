import React from 'react';

interface PriceFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const priceRanges = [
  { label: 'Todos', value: '0-99999' },
  { label: 'R$0 - R$50', value: '0-50' },
  { label: 'R$50 - R$100', value: '50-100' },
  { label: 'R$100 - R$500', value: '100-500' },
  { label: 'R$500+', value: '500-99999' },
];

const PriceFilter: React.FC<PriceFilterProps> = ({ selectedRange, onRangeChange }) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 text-white">Filtrar por Preço</h3>
      <div className="space-y-2">
        {priceRanges.map(range => (
          <div key={range.value} className="flex items-center">
            <input
              type="radio"
              id={`price-${range.value}`}
              name="price-range"
              value={range.value}
              checked={selectedRange === range.value}
              onChange={(e) => onRangeChange(e.target.value)}
              className="h-4 w-4 text-primary-600 border-slate-300 focus:ring-primary-500"
            />
            <label htmlFor={`price-${range.value}`} className="ml-3 block text-sm font-medium text-slate-300">
              {range.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter;