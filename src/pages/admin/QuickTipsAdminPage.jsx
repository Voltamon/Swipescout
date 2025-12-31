import React, { useEffect, useState } from 'react';
import { getQuickTips, createQuickTip, deleteQuickTip, updateQuickTip } from '@/services/api';
import i18n from 'i18next';

const QuickTipsAdminPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', tip: '', category: '', icon: '' });
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
      const res = await getQuickTips(100);
      if (res?.data?.tips) setTips(res.data.tips);
    } catch (err) {
      console.error('Failed to load quick tips', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // simple validation
    const nextErrors = {};
    if (!form.title || !String(form.title).trim()) nextErrors.title = i18n.t('auto_title_is_required');
    if (!form.tip || !String(form.tip).trim()) nextErrors.tip = 'Tip is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await updateQuickTip(editingId, form);
        if (res?.data?.tip) {
          setTips((s) => s.map((t) => (t.id === editingId ? res.data.tip : t)));
          setEditingId(null);
        }
      } else {
        const res = await createQuickTip(form);
        if (res?.data?.tip) setTips((s) => [res.data.tip, ...s]);
      }
      setForm({ title: '', tip: '', category: '', icon: '' });
      setErrors({});
      setMessage('Saved');
      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      console.error('Save quick tip failed', err);
      alert('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tip?')) return;
    try {
      await deleteQuickTip(id);
      setTips((s) => s.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const handleEdit = (tip) => {
    setForm({ title: tip.title || '', tip: tip.tip || '', category: tip.category || '', icon: tip.icon || '' });
    setEditingId(tip.id);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', tip: '', category: '', icon: '' });
    setErrors({});
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{i18n.t('auto_quick_tips_admin')}</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={i18n.t('auto_title')} 
            className={`w-full p-2 border ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <div className="text-xs text-red-600">{errors.title}</div>}
        </div>
        <div>
          <textarea
            value={form.tip}
            onChange={(e) => setForm({ ...form, tip: e.target.value })}
            placeholder={i18n.t('auto_tip')} 
            className={`w-full p-2 border ${errors.tip ? 'border-red-500' : ''}`}
          />
          {errors.tip && <div className="text-xs text-red-600">{errors.tip}</div>}
        </div>
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder={i18n.t('auto_category')}  className="w-full p-2 border" />
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder={i18n.t('auto_icon')}  className="w-full p-2 border" />
        <div className="flex gap-2">
          <button type="submit" disabled={isSaving} className={`px-3 py-1 text-white rounded ${isSaving ? 'bg-gray-400' : 'bg-blue-600'}`}>
            {isSaving ? 'Saving...' : (editingId ? 'Save' : 'Create')}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="px-3 py-1 bg-gray-300 rounded">{i18n.t('auto_cancel')}</button>
          )}
        </div>
      </form>
      {message && <div className="text-sm text-green-600 mb-4">{message}</div>}

      <div>
        <h3 className="font-semibold mb-2">{i18n.t('auto_existing_tips')}</h3>
        {loading ? <div>{i18n.t('auto_loading')}</div> : (
          <ul className="space-y-2">
            {tips.map((t) => (
              <li key={t.id} className="p-2 border rounded flex justify-between items-start">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-gray-700">{t.tip}</div>
                  <div className="text-xs text-gray-500">{t.category}</div>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <button onClick={() => handleEdit(t)} className="text-blue-600">{i18n.t('auto_edit')}</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600">{i18n.t('auto_delete')}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuickTipsAdminPage;
