// comercial/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types'; //
import { api } from '../services/api'; //
import Button from '../components/ui/Button'; //
// REMOVA: import { useCart } from '../hooks/useCart';
// REMOVA: import { ShoppingCart } from 'lucide-react';
import { Tag } from 'lucide-react'; //

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // REMOVA: const { addToCart } = useCart();
  // REMOVA: const [addedMessage, setAddedMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setIsLoading(true);
      try {
        const fetchedProduct = await api.fetchProductById(productId);
        setProduct(fetchedProduct || null);
      } catch (error) {
        console.error("Falha ao buscar produto", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  
  // REMOVA ESTA FUNÇÃO INTEIRA:
  // const handleAddToCart = () => {
  //   if (product) {
  //     addToCart(product);
  //     setAddedMessage('Produto adicionado ao carrinho!');
  //     setTimeout(() => {
  //       setAddedMessage('');
  //     }, 3000);
  //   }
  // };

  if (isLoading) {
    return <div className="text-center py-12">Carregando detalhes do produto...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Produto não encontrado.</div>;
  }
  
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{product.name}</h1>
          <p className="mt-4 text-slate-300">{product.description}</p>
          <div className="my-6">
            {product.discountPercentage > 0 && (
              <p className="text-xl text-red-500 line-through">
                Preço Original: R${product.price.toFixed(2)}
              </p>
            )}
            <p className="text-3xl font-bold text-white">
              <span className="text-lg font-normal">Preço: </span>R${discountedPrice.toFixed(2)}
            </p>
          </div>
          
          {product.couponCode && (
            <div className="bg-slate-700 p-4 rounded-lg space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Tag className="text-primary-500" size={20} />
                <h4 className="font-semibold text-lg">Cupom de Desconto Disponível!</h4>
              </div>
              <p className="text-sm text-slate-300">
                Na hora da compra, utilize o cupom <strong>{product.couponCode}</strong> para ganhar <strong>10%</strong> de desconto extra.
              </p>
            </div>
          )}


          <div className="mt-auto space-y-4">
            {/* REMOVA ESTE BLOCO DO BOTÃO "ADICIONAR AO CARRINHO":
            <Button onClick={handleAddToCart} variant="secondary" className="w-full py-3 text-lg flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Adicionar ao Carrinho
            </Button>
            */}
            <a href={product.buyLink} target="_blank" rel="noopener noreferrer">
              <Button className="px-8 py-3 text-lg w-full">
                Comprar Agora
              </Button>
            </a>
            {/* REMOVA ESTE BLOCO DA MENSAGEM DO CARRINHO:
            {addedMessage && <p className="text-center text-green-400 mt-2">{addedMessage}</p>}
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;