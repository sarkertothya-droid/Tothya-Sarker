import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/ecommerce';
import {
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  ArrowUpDown,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Archive,
} from 'lucide-react';
import { AdminAddProduct } from './AdminAddProduct';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    deleteProduct,
    duplicateProduct,
    setAdminActiveSection,
    formatPrice,
    setSelectedProductId,
    setCurrentView,
    setStorePage,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!matches) return false;
        }

        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        if (selectedStatus !== 'all' && p.status !== selectedStatus) {
          return false;
        }

        if (selectedStockStatus === 'in_stock' && p.stock <= 0) return false;
        if (selectedStockStatus === 'low_stock' && (p.stock <= 0 || p.stock > 4)) return false;
        if (selectedStockStatus === 'out_of_stock' && p.stock > 0) return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }

        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [products, search, selectedCategory, selectedStockStatus, selectedStatus, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete or archive this product?')) {
      const res = deleteProduct(id);
      if (res.error) {
        setAlertMessage({ text: res.error, isError: false });
      } else {
        setAlertMessage({ text: 'Product removed successfully.', isError: false });
      }
    }
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateProduct(id);
    setAlertMessage({ text: `Duplicated into draft: "${dup.name}"`, isError: false });
  };

  const handleBulkArchive = () => {
    if (selectedRowIds.length === 0) return;
    if (window.confirm(`Archive ${selectedRowIds.length} selected items?`)) {
      selectedRowIds.forEach((id) => deleteProduct(id));
      setSelectedRowIds([]);
      setAlertMessage({ text: 'Bulk operation completed.', isError: false });
    }
  };

  if (editingProduct) {
    return (
      <AdminAddProduct
        editingProduct={editingProduct}
        onDone={() => setEditingProduct(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Atelier Products Management
          </h1>
          <p className="text-xs text-[#78716C]">
            View, edit, duplicate, and monitor inventory for all {products.length} registered creations.
          </p>
        </div>

        <button
          onClick={() => setAdminActiveSection('add_product')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1A1918] hover:bg-[#332E2B] rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {alertMessage && (
        <div
          className={`p-3 text-xs rounded-xl flex items-center justify-between ${
            alertMessage.isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{alertMessage.text}</span>
          </div>
          <button
            onClick={() => setAlertMessage(null)}
            className="text-xs text-[#78716C] hover:text-[#1A1918]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E4DA] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, SKU, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#DDD5C5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7B4F]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#FAF9F5] border border-[#DDD5C5] rounded-md text-xs cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock */}
          <select
            value={selectedStockStatus}
            onChange={(e) => {
              setSelectedStockStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#FAF9F5] border border-[#DDD5C5] rounded-md text-xs cursor-pointer"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock (&gt; 0)</option>
            <option value="low_stock">Low Stock (1–4)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Publication Status */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#FAF9F5] border border-[#DDD5C5] rounded-md text-xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Bulk actions */}
          {selectedRowIds.length > 0 && (
            <button
              onClick={handleBulkArchive}
              className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md font-medium hover:bg-amber-100 cursor-pointer"
            >
              Bulk Archive ({selectedRowIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px] tracking-wider">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProducts.length > 0 &&
                      paginatedProducts.every((p) => selectedRowIds.includes(p.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded border-[#D5CBB8] text-[#1A1918]"
                  />
                </th>
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#1A1918]"
                  onClick={() => {
                    setSortField('price');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#1A1918]"
                  onClick={() => {
                    setSortField('stock');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Stock</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#78716C]">
                    No creations match your current filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(prod.id)}
                        onChange={() => handleToggleRow(prod.id)}
                        className="rounded border-[#D5CBB8] text-[#1A1918]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0] || ''}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-[#F5F2EB] border border-[#E8E4DA] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-editorial text-sm font-medium text-[#1A1918] block truncate">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-[#A8A29E]">
                            {new Date(prod.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#57534E]">{prod.sku}</td>
                    <td className="py-3 px-4 text-[#57534E]">{prod.category}</td>
                    <td className="py-3 px-4 font-mono font-medium text-[#1A1918] tabular-nums">
                      {formatPrice(prod.discountedPrice ?? prod.price)}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <span
                        className={`font-semibold ${
                          prod.stock === 0
                            ? 'text-red-700'
                            : prod.stock <= 4
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                          prod.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800'
                            : prod.status === 'draft'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview on store */}
                        <button
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setCurrentView('store');
                            setStorePage('detail');
                          }}
                          className="p-1 text-[#78716C] hover:text-[#1A1918] cursor-pointer"
                          title="Preview on Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1 text-[#78716C] hover:text-[#1A1918] cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(prod.id)}
                          className="p-1 text-[#78716C] hover:text-[#1A1918] cursor-pointer"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Archive / Delete */}
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1 text-[#78716C] hover:text-red-700 cursor-pointer"
                          title="Delete or Archive Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E8E4DA] flex items-center justify-between text-xs text-[#78716C]">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} items
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-white border border-[#DDD5C5] rounded-md disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-white border border-[#DDD5C5] rounded-md disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
