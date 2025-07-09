// comercial/services/api.ts
import { Product, Category, BannerContent } from '../types'; //

// APONTE PARA O SEU ENDEREÇO LOCAL DO BACKEND PHP
// Se sua pasta PHP está em C:/xampp/htdocs/ecommerce_php/, a URL será http://localhost/ecommerce_php
const BASE_URL = 'http://promobia.online/'; 

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro na requisição da API');
  }
  // Algumas operações (DELETE, POST/PUT que retornam apenas mensagem) podem não ter um corpo JSON.
  // Verifica se a resposta não está vazia antes de tentar parsear como JSON.
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const api = {
  fetchCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${BASE_URL}/categories.php`);
    return handleResponse(response);
  },
  fetchProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products.php`);
    return handleResponse(response);
  },
  fetchProductById: async (id: string): Promise<Product | undefined> => {
    const response = await fetch(`${BASE_URL}/products.php?id=${id}`);
    const data = await handleResponse(response);
    return data[0] || undefined; // O backend GET retorna um array, pegamos o primeiro item
  },
  fetchProductsByCategoryId: async (categoryId: string): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products.php?categoryId=${categoryId}`);
    return handleResponse(response);
  },
  // ... (seus imports e BASE_URL)

// Nova função para upload de imagem
// Esta função envia o arquivo e espera a URL permanente de volta
uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file); // 'image' será o nome do campo no $_FILES do PHP

    const response = await fetch(`${BASE_URL}/upload.php`, { // Você criará este arquivo upload.php
        method: 'POST',
        body: formData, // Não defina 'Content-Type' aqui, o navegador faz isso automaticamente para FormData
    });

    return handleResponse(response); // Espera { imageUrl: "caminho/para/imagem.jpg" }
},

// ... (as outras funções da sua API, como fetchProducts, addProduct, etc.)
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const result = await handleResponse(response);
    return { ...product, id: result.id }; // Retorna o produto com o ID gerado pelo backend
  },
  updateProduct: async (updatedProduct: Product): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
    await handleResponse(response);
    return updatedProduct; // Retorna o produto atualizado
  },
  deleteProduct: async (productId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/products.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    });
    await handleResponse(response);
  },

  addCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const response = await fetch(`${BASE_URL}/categories.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    const result = await handleResponse(response);
    return { ...category, id: result.id };
  },
  updateCategory: async (updatedCategory: Category): Promise<Category> => {
    const response = await fetch(`${BASE_URL}/categories.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCategory),
    });
    await handleResponse(response);
    return updatedCategory;
  },
  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/categories.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: categoryId }),
    });
    await handleResponse(response);
  },

  fetchBanners: async (): Promise<BannerContent[]> => {
    const response = await fetch(`${BASE_URL}/banners.php`);
    return handleResponse(response);
  },
  addBanner: async (banner: Omit<BannerContent, 'id'>): Promise<BannerContent> => {
    const response = await fetch(`${BASE_URL}/banners.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banner),
    });
    const result = await handleResponse(response);
    return { ...banner, id: result.id };
  },
  updateBanner: async (updatedBanner: BannerContent): Promise<BannerContent> => {
    const response = await fetch(`${BASE_URL}/banners.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBanner),
    });
    await handleResponse(response);
    return updatedBanner;
  },
  deleteBanner: async (bannerId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/banners.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bannerId }),
    });
    await handleResponse(response);
  }
  
};
