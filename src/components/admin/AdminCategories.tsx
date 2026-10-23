import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FolderTree, Plus, Trash2 } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory, products } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
    });

    setName('');
    setDescription('');
    setSuccess('Category added successfully.');
    setTimeout(() => setSuccess(''), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Category Taxonomy
          </h1>
          <p className="text-xs text-[#78716C]">
            Organize catalog disciplines and navigational hierarchies.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
        
        {/* Create Category */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
            Add New Discipline
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fine Porcelain Sculptures"
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short editorial summary of materials and atelier origin..."
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Category</span>
            </button>
          </form>
        </div>

        {/* Existing Categories Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E8E4DA]">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium">
              Registered Disciplines ({categories.length})
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-4">Discipline</th>
                <th className="py-2.5 px-4">Slug</th>
                <th className="py-2.5 px-4">Products</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {categories.map((c) => {
                const prodCount = products.filter((p) => p.category === c.name).length;
                return (
                  <tr key={c.id} className="hover:bg-[#FAF9F5]">
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#1A1918] block">{c.name}</span>
                      <span className="text-[10px] text-[#78716C] line-clamp-1">{c.description}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#78716C]">{c.slug}</td>
                    <td className="py-3 px-4 font-mono">{prodCount} pieces</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="p-1 text-[#78716C] hover:text-red-700 cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
