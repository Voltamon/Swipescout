import React, { useEffect, useState } from 'react';
import { getCareerPaths, createCareerPath, deleteCareerPath, updateCareerPath } from '@/services/api';

const CareerPathsAdminPage = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', steps: '', duration: '', skills: '', salary: '', demand: '', icon: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCareerPaths(100);
      if (res?.data?.careerPaths) setPaths(res.data.careerPaths);
    } catch (err) {
      console.error('Failed to load career paths', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.title || !String(form.title).trim()) nextErrors.title = 'Title is required';
    if (!form.description || !String(form.description).trim()) nextErrors.description = 'Description is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = { ...form, skills: form.skills ? form.skills.split(',').map((s) => s.trim()) : [] };
    setIsSaving(true);
    try {
      if (editingId) {
        const res = await updateCareerPath(editingId, payload);
        if (res?.data?.careerPath) {
          setPaths((s) => s.map((p) => (p.id === editingId ? res.data.careerPath : p)));
          setEditingId(null);
        }
      } else {
        const res = await createCareerPath(payload);
        if (res?.data?.careerPath) setPaths((s) => [res.data.careerPath, ...s]);
      }
      setForm({ title: '', description: '', steps: '', duration: '', skills: '', salary: '', demand: '', icon: '' });
      setErrors({});
      setMessage('Saved');
      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      console.error('Save career path failed', err);
      alert('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this career path?')) return;
    try {
      await deleteCareerPath(id);
      setPaths((s) => s.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title || '',
      description: p.description || '',
      steps: p.steps || '',
      duration: p.duration || '',
      skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || ''),
      salary: p.salary || '',
      demand: p.demand || '',
      icon: p.icon || ''
    });
    setEditingId(p.id);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', steps: '', duration: '', skills: '', salary: '', demand: '', icon: '' });
    setErrors({});
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Career Paths Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className={`w-full p-2 border ${errors.title ? 'border-red-500' : ''}`} />
          {errors.title && <div className="text-xs text-red-600">{errors.title}</div>}
        </div>
        <div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className={`w-full p-2 border ${errors.description ? 'border-red-500' : ''}`} />
          {errors.description && <div className="text-xs text-red-600">{errors.description}</div>}
        </div>
        <input value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} placeholder="Steps (plain text)" className="w-full p-2 border" />
        <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration" className="w-full p-2 border" />
        <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated)" className="w-full p-2 border" />
        <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="Salary" className="w-full p-2 border" />
        <input value={form.demand} onChange={(e) => setForm({ ...form, demand: e.target.value })} placeholder="Demand" className="w-full p-2 border" />
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon" className="w-full p-2 border" />
        <div className="flex gap-2">
          <button type="submit" disabled={isSaving} className={`px-3 py-1 text-white rounded ${isSaving ? 'bg-gray-400' : 'bg-blue-600'}`}>{isSaving ? 'Saving...' : (editingId ? 'Save' : 'Create')}</button>
          {editingId && <button type="button" onClick={handleCancelEdit} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>}
        </div>
      </form>
  {message && <div className="text-sm text-green-600 mb-4">{message}</div>}

      <div>
        <h3 className="font-semibold mb-2">Existing Paths</h3>
        {loading ? <div>Loading...</div> : (
          <ul className="space-y-2">
            {paths.map((p) => (
              <li key={p.id} className="p-2 border rounded flex justify-between items-start">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-700">{p.description}</div>
                  <div className="text-xs text-gray-500">{p.skills && p.skills.join(', ')}</div>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CareerPathsAdminPage;
