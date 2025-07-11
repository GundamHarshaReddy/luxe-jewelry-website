import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Package, 
  Search,
  Filter,
  X,
  Save
} from 'lucide-react';
import { adminProductService } from '../../lib/adminProductService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Product, ProductVariant } from '../../types';

interface AdminProductsProps {}

const AdminProducts: React.FC<AdminProductsProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await adminProductService.getAllProducts();
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await adminProductService.deleteProduct(productId);
      await loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const handleToggleFeatured = async (productId: string, isFeatured: boolean) => {
    try {
      await adminProductService.toggleFeatured(productId, !isFeatured);
      await loadProducts();
    } catch (err) {
      console.error('Error toggling featured status:', err);
      setError('Failed to update featured status');
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage your jewelry inventory</p>
        </div>
        <Button onClick={handleCreateProduct} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onToggleFeatured={handleToggleFeatured}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || categoryFilter !== 'all' ? 'Try adjusting your search or filters' : 'Get started by creating your first product'}
          </p>
          <Button onClick={handleCreateProduct}>
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <ProductFormModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSave={loadProducts}
            mode="create"
          />
        )}
        {showEditModal && selectedProduct && (
          <ProductFormModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={loadProducts}
            mode="edit"
            product={selectedProduct}
          />
        )}
        {showViewModal && selectedProduct && (
          <ProductViewModal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            product={selectedProduct}
            onEdit={() => {
              setShowViewModal(false);
              setShowEditModal(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleFeatured: (productId: string, isFeatured: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured
}) => {
  const primaryVariant = product.variants?.[0];
  const imageUrl = primaryVariant?.images?.[0] || '/placeholder-image.jpg';
  const totalStock = product.variants?.reduce((sum, variant) => sum + variant.stock, 0) || 0;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      layout
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.is_featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
          totalStock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {totalStock > 0 ? `Stock: ${totalStock}` : 'Out of Stock'}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <button
            onClick={() => onToggleFeatured(product.id, product.is_featured)}
            className={`ml-2 p-1 rounded ${
              product.is_featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Star size={16} fill={product.is_featured ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.base_price.toLocaleString('en-IN')}
          </span>
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
        </div>

        {/* Materials */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.materials.slice(0, 2).map((material, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {material}
            </span>
          ))}
          {product.materials.length > 2 && (
            <span className="text-xs text-gray-500">+{product.materials.length - 2}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(product)}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
          >
            <Eye size={14} />
            <span>View</span>
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Product View Modal Component
interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onEdit: () => void;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({
  onClose,
  product,
  onEdit
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant = product.variants?.[selectedVariantIndex];
  const images = selectedVariant?.images || ['/placeholder-image.jpg'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit size={16} className="mr-2" />
              Edit Product
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="mb-4">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Price:</span> ₹{product.base_price.toLocaleString('en-IN')}</p>
                  <p><span className="font-medium">Category:</span> {product.category}</p>
                  <p><span className="font-medium">Featured:</span> {product.is_featured ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Description:</span> {product.description}</p>
                </div>
              </div>

              {/* Color Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Color Variants</h3>
                  <div className="space-y-2">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`w-full p-3 border rounded-lg text-left ${
                          selectedVariantIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: variant.colorCode }}
                          />
                          <div>
                            <p className="font-medium">{variant.color}</p>
                            <p className="text-sm text-gray-600">
                              Stock: {variant.stock} | Price: +₹{variant.price}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Care Instructions */}
              {product.care_instructions && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Care Instructions</h3>
                  <p className="text-gray-600">{product.care_instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Product Form Modal Component
interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  mode: 'create' | 'edit';
  product?: Product;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  onClose,
  onSave,
  mode,
  product
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    detailed_description: product?.detailed_description || '',
    base_price: product?.base_price || 0,
    category: product?.category || 'bangles',
    sizes: product?.sizes || [],
    materials: product?.materials || [],
    features: product?.features || [],
    care_instructions: product?.care_instructions || '',
    is_featured: product?.is_featured || false,
    tags: product?.tags || []
  });

  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<number[]>([]);

  // Form field helpers
  const [newSize, setNewSize] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate variants - only include variants with required fields
      const validVariants = variants.filter(variant => 
        variant.color && variant.color.trim() !== ''
      );

      const productDataWithVariants = {
        ...formData,
        variants: validVariants
      };

      if (mode === 'create') {
        await adminProductService.createProduct(productDataWithVariants);
      } else if (product) {
        await adminProductService.updateProduct({ id: product.id, ...productDataWithVariants });
      }
      
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field: keyof typeof formData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setter('');
    }
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}`,
      color: '',
      colorCode: '#000000',
      images: [],
      stock: 0,
      price: 0
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (₹) *
              </label>
              <Input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData(prev => ({ ...prev, base_price: Number(e.target.value) }))}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="bangles">Bangles</option>
                <option value="bracelets">Bracelets</option>
                <option value="rings">Rings</option>
                <option value="necklaces">Necklaces</option>
                <option value="earrings">Earrings</option>
                <option value="anklets">Anklets</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              value={formData.detailed_description}
              onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed product description"
            />
          </div>

          {/* Dynamic Arrays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="e.g., 2.1, 2.2, 2.3"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('sizes', newSize, setNewSize))}
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem('sizes', newSize, setNewSize)}
                  variant="outline"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sizes', index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materials</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="e.g., Gold, Silver, Diamond"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('materials', newMaterial, setNewMaterial))}
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem('materials', newMaterial, setNewMaterial)}
                  variant="outline"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.materials.map((material, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {material}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('materials', index)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g., Adjustable, Waterproof, Hypoallergenic"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('features', newFeature, setNewFeature))}
              />
              <Button
                type="button"
                onClick={() => addArrayItem('features', newFeature, setNewFeature)}
                variant="outline"
              >
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., wedding, casual, traditional"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', newTag, setNewTag))}
              />
              <Button
                type="button"
                onClick={() => addArrayItem('tags', newTag, setNewTag)}
                variant="outline"
              >
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tags', index)}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Care Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Care Instructions
            </label>
            <textarea
              value={formData.care_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="How to care for this product"
            />
          </div>

          {/* Color Variants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Color Variants</h3>
              <Button type="button" onClick={addVariant} variant="outline">
                <Plus size={16} className="mr-2" />
                Add Variant
              </Button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeVariant(index)}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color Name
                      </label>
                      <Input
                        value={variant.color}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                        placeholder="e.g., Rose Gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color Code
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={variant.colorCode}
                          onChange={(e) => updateVariant(index, 'colorCode', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={variant.colorCode}
                          onChange={(e) => updateVariant(index, 'colorCode', e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Image URLs */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                    </label>
                    
                    {/* File Upload Section */}
                    <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <input
                          type="file"
                          id={`file-upload-${index}`}
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            console.log(`Selected ${files.length} files for variant ${index}`);
                            
                            if (files.length === 0) return;
                            
                            setUploadingImages(prev => [...prev, index]);
                            
                            files.forEach((file, fileIndex) => {
                              console.log(`Processing file ${fileIndex + 1}: ${file.name}, size: ${file.size} bytes`);
                              
                              if (file.size > 5 * 1024 * 1024) { // 5MB limit
                                console.warn(`File ${file.name} is too large (${file.size} bytes)`);
                                setError(`File ${file.name} is too large. Please use images under 5MB.`);
                                setUploadingImages(prev => prev.filter(i => i !== index));
                                return;
                              }
                              
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64Image = event.target?.result as string;
                                console.log(`File ${file.name} converted to base64, length: ${base64Image.length}`);
                                const currentImages = variant.images || [];
                                updateVariant(index, 'images', [...currentImages, base64Image]);
                                
                                // Remove from uploading state when last file is processed
                                if (fileIndex === files.length - 1) {
                                  setUploadingImages(prev => prev.filter(i => i !== index));
                                }
                              };
                              reader.onerror = (error) => {
                                console.error(`Error reading file ${file.name}:`, error);
                                setError(`Failed to read file ${file.name}`);
                                setUploadingImages(prev => prev.filter(i => i !== index));
                              };
                              reader.readAsDataURL(file);
                            });
                            // Clear the input
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor={`file-upload-${index}`}
                          className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                            uploadingImages.includes(index) 
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {uploadingImages.includes(index) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus size={16} className="mr-2" />
                              Upload Images from Computer
                            </>
                          )}
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          Select multiple images (JPG, PNG, GIF) from your computer
                        </p>
                      </div>
                    </div>

                    {/* URL Input Section */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Or add image URLs (one per line)
                      </label>
                      <textarea
                        value={variant.images.filter(img => img.startsWith('http')).join('\n')}
                        onChange={(e) => {
                          const urlImages = e.target.value.split('\n').filter(url => url.trim() && url.startsWith('http'));
                          const base64Images = variant.images.filter(img => img.startsWith('data:'));
                          updateVariant(index, 'images', [...base64Images, ...urlImages]);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                      <div className="text-sm text-gray-500">
                        <p><strong>✅ Recommended:</strong> Use Unsplash, Imgur, or Cloudinary URLs</p>
                        <p><strong>❌ Avoid:</strong> Google encrypted URLs (they won't work due to CORS)</p>
                        <p><strong>💡 Example:</strong> https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80</p>
                      </div>
                    </div>
                    
                    {/* Image Preview */}
                    {variant.images.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {variant.images.slice(0, 6).map((imageUrl, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={imageUrl}
                                alt={`Preview ${imgIndex + 1}`}
                                className="w-full h-20 object-cover rounded border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/400x300/f3f4f6/6b7280?text=Image+Not+Available';
                                  target.style.border = '2px solid #ef4444';
                                }}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.border = '2px solid #10b981';
                                }}
                              />
                              <div className="absolute top-1 right-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = variant.images.filter((_, i) => i !== imgIndex);
                                    updateVariant(index, 'images', newImages);
                                  }}
                                  className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="absolute bottom-1 left-1">
                                <span className="bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                  {imageUrl.startsWith('data:') ? 'Local' : 'URL'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {variant.images.length > 6 && (
                          <p className="text-sm text-gray-500 mt-2">
                            +{variant.images.length - 6} more images
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {mode === 'create' ? 'Create Product' : 'Update Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminProducts;