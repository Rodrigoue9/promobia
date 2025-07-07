import React, { useState, useEffect } from 'react';
import { Product, Category, BannerContent } from '../types'; //
import { api } from '../services/api'; //
import Button from '../components/ui/Button'; //
import Input from '../components/ui/Input'; //
import FileInput from '../components/ui/FileInput'; //
import { Edit, Trash2, Package, Tag, Image as ImageIcon } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<BannerContent[]>([]);
  
  // ESTADO CORRIGIDO: activeTab DEVE ESTAR AQUI
  const [activeTab, setActiveTab] = useState('products'); 
  
  // Editing states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBanner, setEditingBanner] = useState<BannerContent | null>(null);

  // Form states
  const [productName, setProductName] = useState('');
  // productImage agora guarda a URL PERMANENTE da imagem
  const [productImage, setProductImage] = useState(''); 
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [productBuyLink, setProductBuyLink] = useState('');
  const [productCoupon, setProductCoupon] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  
  const [categoryName, setCategoryName] = useState('');
  // categoryImage agora guarda a URL PERMANENTE da imagem
  const [categoryImage, setCategoryImage] = useState(''); 
  
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  // bannerImage agora guarda a URL PERMANENTE da imagem
  const [bannerImage, setBannerImage] = useState(''); 
  const [bannerButtonText, setBannerButtonText] = useState('');
  const [bannerLink, setBannerLink] = useState('');

  // NOVOS ESTADOS para os arquivos selecionados (os "File" objects)
  const [selectedProductImageFile, setSelectedProductImageFile] = useState<File | null>(null);
  const [selectedCategoryImageFile, setSelectedCategoryImageFile] = useState<File | null>(null);
  const [selectedBannerImageFile, setSelectedBannerImageFile] = useState<File | null>(null);

  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [prods, cats, bannerData] = await Promise.all([
                api.fetchProducts(),
                api.fetchCategories(),
                api.fetchBanners()
            ]);
            setProducts(prods);
            setCategories(cats);
            setBanners(bannerData);
        } catch (error) {
            console.error("Falha ao buscar dados no AdminPage:", error);
            showFeedback('Falha ao carregar dados. Verifique o console.', 'error');
        }
    };
    fetchData();
  }, []);

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  // FORM RESETS
  const resetProductForm = () => {
    setEditingProduct(null); 
    setProductName(''); 
    setProductDescription(''); 
    setProductImage(''); // Reseta a URL da imagem
    setSelectedProductImageFile(null); // Reseta o arquivo selecionado para upload
    setProductPrice(0); 
    setProductDiscount(0); 
    setProductBuyLink(''); 
    setProductCoupon(''); 
    setProductCategory('');
  };
  const resetCategoryForm = () => {
    setEditingCategory(null); 
    setCategoryName(''); 
    setCategoryImage(''); // Reseta a URL da imagem
    setSelectedCategoryImageFile(null); // Reseta o arquivo selecionado para upload
  };
  const resetBannerForm = () => {
    setEditingBanner(null); 
    setBannerTitle(''); 
    setBannerSubtitle(''); 
    setBannerImage(''); // Reseta a URL da imagem
    setSelectedBannerImageFile(null); // Reseta o arquivo selecionado para upload
    setBannerButtonText(''); 
    setBannerLink('');
  };

  // PRODUCT HANDLERS
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productCategory) {
      showFeedback('Nome do Produto e Categoria são obrigatórios.', 'error');
      return;
    }

    let finalImageUrl = productImage; // Começa com a URL existente (se for edição)

    // Se um NOVO arquivo foi selecionado, faça o upload primeiro
    if (selectedProductImageFile) {
      try {
        const uploadResult = await api.uploadImage(selectedProductImageFile);
        finalImageUrl = uploadResult.imageUrl; // Recebe a URL permanente do servidor
      } catch (uploadError) {
        console.error("Falha ao fazer upload da imagem do produto:", uploadError);
        showFeedback('Falha ao fazer upload da imagem do produto.', 'error');
        return;
      }
    } else if (!finalImageUrl) {
        // Se não tem arquivo selecionado e não tem URL existente, usa fallback ou mostra erro
        finalImageUrl = `https://picsum.photos/seed/${encodeURIComponent(productName)}/500/500`;
    }

    const productData = {
      name: productName, 
      description: productDescription, 
      image: finalImageUrl, // Usa a URL permanente
      price: productPrice, 
      discountPercentage: productDiscount, 
      buyLink: productBuyLink, 
      couponCode: productCoupon, 
      categoryId: productCategory
    };

    try {
      if (editingProduct) {
        const updatedProduct = await api.updateProduct({ ...productData, id: editingProduct.id });
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        showFeedback('Produto atualizado com sucesso!', 'success');
      } else {
        const newProduct = await api.addProduct(productData);
        setProducts([...products, newProduct]);
        showFeedback('Produto adicionado com sucesso!', 'success');
      }
      resetProductForm();
    } catch (error) {
      showFeedback('Falha ao salvar produto.', 'error');
    }
  };
  
  // Modifique handleEditProduct
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product); 
    setProductName(product.name); 
    setProductDescription(product.description); 
    setProductImage(product.image); // Carrega a URL existente
    setSelectedProductImageFile(null); // Garante que nenhum novo arquivo está pré-selecionado
    setProductPrice(product.price); 
    setProductDiscount(product.discountPercentage); 
    setProductBuyLink(product.buyLink); 
    setProductCoupon(product.couponCode || ''); 
    setProductCategory(product.categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
        showFeedback('Produto excluído com sucesso!', 'success');
      } catch (error) {
        showFeedback('Falha ao excluir o produto.', 'error');
      }
    }
  };

  // CATEGORY HANDLERS
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) {
      showFeedback('Nome da Categoria é obrigatório.', 'error'); 
      return;
    }

    let finalImageUrl = categoryImage;

    if (selectedCategoryImageFile) {
        try {
            const uploadResult = await api.uploadImage(selectedCategoryImageFile);
            finalImageUrl = uploadResult.imageUrl;
        } catch (uploadError) {
            console.error("Falha ao fazer upload da imagem da categoria:", uploadError);
            showFeedback('Falha ao fazer upload da imagem da categoria.', 'error');
            return;
        }
    } else if (!finalImageUrl) {
        finalImageUrl = `https://picsum.photos/seed/${encodeURIComponent(categoryName)}/600/400`;
    }

    const categoryData = { name: categoryName, image: finalImageUrl };

    try {
      if (editingCategory) {
        const updatedCategory = await api.updateCategory({ ...categoryData, id: editingCategory.id });
        setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        showFeedback('Categoria atualizada com sucesso!', 'success');
      } else {
        const newCategory = await api.addCategory(categoryData);
        setCategories([...categories, newCategory]);
        showFeedback('Categoria adicionada com sucesso!', 'success');
      }
      resetCategoryForm();
    } catch (error) {
      showFeedback('Falha ao salvar categoria.', 'error');
    }
  };
  // Modifique handleEditCategory
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category); 
    setCategoryName(category.name); 
    setCategoryImage(category.image); 
    setSelectedCategoryImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.deleteCategory(categoryId);
        setCategories(categories.filter(c => c.id !== categoryId));
        showFeedback('Categoria excluída com sucesso!', 'success');
      } catch (error: any) {
        showFeedback(error.message || 'Falha ao excluir a categoria.', 'error');
      }
    }
  };
  
  // BANNER HANDLERS
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = bannerImage;

    if (selectedBannerImageFile) {
        try {
            const uploadResult = await api.uploadImage(selectedBannerImageFile);
            finalImageUrl = uploadResult.imageUrl;
        } catch (uploadError) {
            console.error("Falha ao fazer upload da imagem do banner:", uploadError);
            showFeedback('Falha ao fazer upload da imagem do banner.', 'error');
            return;
        }
    } else if (!finalImageUrl) {
      // Banners devem ter imagem, então talvez um erro ou um placeholder genérico
      showFeedback('A imagem do banner é obrigatória.', 'error');
      return;
    }

    const bannerData = { title: bannerTitle, subtitle: bannerSubtitle, image: finalImageUrl, buttonText: bannerButtonText, link: bannerLink };
    
    try {
      if (editingBanner) {
        const updatedBanner = await api.updateBanner({ ...bannerData, id: editingBanner.id });
        setBanners(banners.map(b => b.id === updatedBanner.id ? updatedBanner : b));
        showFeedback('Banner atualizado com sucesso!', 'success');
      } else {
        const newBanner = await api.addBanner(bannerData);
        setBanners([...banners, newBanner]);
        showFeedback('Banner adicionado com sucesso!', 'success');
      }
      resetBannerForm();
    } catch (error) {
      showFeedback('Falha ao salvar o banner.', 'error');
    }
  };
  // Modifique handleEditBanner
  const handleEditBanner = (banner: BannerContent) => {
    setEditingBanner(banner); 
    setBannerTitle(banner.title); 
    setBannerSubtitle(banner.subtitle); 
    setBannerImage(banner.image); 
    setSelectedBannerImageFile(null);
    setBannerButtonText(banner.buttonText); 
    setBannerLink(banner.link);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteBanner = async (bannerId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        await api.deleteBanner(bannerId);
        setBanners(banners.filter(b => b.id !== bannerId));
        showFeedback('Banner excluído com sucesso!', 'success');
      } catch (error) {
        showFeedback('Falha ao excluir o banner.', 'error');
      }
    }
  };

  const feedbackColor = feedback.type === 'success' ? 'bg-green-900/50 border-green-600 text-green-300' : 'bg-red-900/50 border-red-600 text-red-300';
  
  const renderTabButton = (tabName: string, label: string, icon: React.ReactNode) => (
    <button onClick={() => setActiveTab(tabName)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tabName ? 'bg-slate-800 text-primary-600 border-b-2 border-primary-600' : 'text-slate-400 hover:text-slate-200'}`}>
      {icon} {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      {feedback.message && <div className={`${feedbackColor} px-4 py-3 rounded-md relative mb-6`} role="alert">{feedback.message}</div>}
      
      <div className="border-b border-slate-700 mb-6">
        <nav className="-mb-px flex space-x-6">
          {renderTabButton('products', 'Produtos', <Package size={16}/>)}
          {renderTabButton('categories', 'Categorias', <Tag size={16}/>)}
          {renderTabButton('banners', 'Banners', <ImageIcon size={16}/>)}
        </nav>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-800 p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <Input label="Nome do Produto" id="productName" value={productName} onChange={e => setProductName(e.target.value)} required />
              <Input label="Descrição" id="productDesc" value={productDescription} onChange={e => setProductDescription(e.target.value)} required />
              {/* ATUALIZADO: Usando onFileSelect e initialValue corretamente */}
              <FileInput 
                label="Imagem do Produto" 
                id="productImage" 
                onFileSelect={setSelectedProductImageFile} 
                initialValue={editingProduct ? editingProduct.image : productImage} 
              />
              <div className="flex gap-4">
                <Input label="Preço (R$)" id="productPrice" type="number" step="0.01" value={productPrice} onChange={e => setProductPrice(parseFloat(e.target.value))} required />
                <Input label="Desconto (%)" id="productDiscount" type="number" value={productDiscount} onChange={e => setProductDiscount(parseFloat(e.target.value))} />
              </div>
              <Input label="Link de Compra" id="productBuyLink" value={productBuyLink} onChange={e => setProductBuyLink(e.target.value)} required />
              <Input label="Cupom (Opcional)" id="productCoupon" value={productCoupon} onChange={e => setProductCoupon(e.target.value)} />
              <div>
                <label htmlFor="productCategory" className="block text-sm font-medium text-slate-300 mb-1">Categoria</label>
                <select id="productCategory" value={productCategory} onChange={e => setProductCategory(e.target.value)} required className="block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  <option value="">Selecione...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-grow">{editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}</Button>
                {editingProduct && <Button type="button" variant="secondary" onClick={resetProductForm}>Cancelar</Button>}
              </div>
            </form>
          </div>
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Produtos Cadastrados</h2>
            <ul className="space-y-3">
              {products.map(product => (
                <li key={product.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded"/>
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <p className="text-sm text-slate-400">{categories.find(c => c.id === product.categoryId)?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditProduct(product)}><Edit size={16} /></Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={16} /></Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-800 p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4">{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <Input label="Nome da Categoria" id="categoryName" value={categoryName} onChange={e => setCategoryName(e.target.value)} required />
              {/* ATUALIZADO: Usando onFileSelect e initialValue corretamente */}
              <FileInput 
                label="Imagem da Categoria" 
                id="categoryImage" 
                onFileSelect={setSelectedCategoryImageFile} 
                initialValue={editingCategory ? editingCategory.image : categoryImage} 
              />
              <div className="flex gap-2">
                  <Button type="submit" className="flex-grow">{editingCategory ? 'Salvar Alterações' : 'Adicionar Categoria'}</Button>
                  {editingCategory && <Button type="button" variant="secondary" onClick={resetCategoryForm}>Cancelar</Button>}
              </div>
            </form>
          </div>
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Categorias Cadastradas</h2>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                   <div className="flex items-center gap-4">
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded"/>
                    <span className="font-medium">{cat.name}</span>
                   </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditCategory(cat)}><Edit size={16} /></Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(cat.id)}><Trash2 size={16} /></Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-slate-800 p-6 rounded-lg shadow-md h-fit">
                <h2 className="text-2xl font-bold mb-4">{editingBanner ? 'Editar Banner' : 'Adicionar Novo Banner'}</h2>
                <form onSubmit={handleBannerSubmit} className="space-y-4">
                    <Input label="Título do Banner" id="bannerTitle" value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} required />
                    <Input label="Subtítulo" id="bannerSubtitle" value={bannerSubtitle} onChange={e => setBannerSubtitle(e.target.value)} required />
                    <Input label="Texto do Botão" id="bannerButton" value={bannerButtonText} onChange={e => setBannerButtonText(e.target.value)} required />
                    <Input label="Link (ex: /category/1)" id="bannerLink" value={bannerLink} onChange={e => setBannerLink(e.target.value)} required />
                    {/* ATUALIZADO: Usando onFileSelect e initialValue corretamente */}
                    <FileInput 
                      label="Imagem do Banner" 
                      id="bannerImage" 
                      onFileSelect={setSelectedBannerImageFile} 
                      initialValue={editingBanner ? editingBanner.image : bannerImage} 
                    />
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-grow">{editingBanner ? 'Salvar Alterações' : 'Adicionar Banner'}</Button>
                        {editingBanner && <Button type="button" variant="secondary" onClick={resetBannerForm}>Cancelar</Button>}
                    </div>
                </form>
            </div>
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Banners Cadastrados</h2>
                <ul className="space-y-3">
                    {banners.map(banner => (
                        <li key={banner.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                            <div className="flex items-center gap-4">
                                <img src={banner.image} alt={banner.title} className="w-16 h-10 object-cover rounded"/>
                                <span className="font-medium">{banner.title}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => handleEditBanner(banner)}><Edit size={16} /></Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteBanner(banner.id)}><Trash2 size={16} /></Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;