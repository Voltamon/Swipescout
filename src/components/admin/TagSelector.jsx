import React, { useState, useMemo } from 'react';
import { Input } from '@/components/UI/input';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/UI/dialog.jsx';
import { Search, Plus, List } from 'lucide-react';

const TagSelector = ({ availableTags = [], selectedTags = [], onToggleTag, onAddTag }) => {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSearch, setDialogSearch] = useState('');
  const [newTag, setNewTag] = useState('');

  const inlineFiltered = useMemo(() => {
    if (!search) return availableTags.slice(0, 10);
    return availableTags.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).slice(0, 10);
  }, [availableTags, search]);

  const dialogFiltered = useMemo(() => {
    if (!dialogSearch) return availableTags;
    return availableTags.filter(t => t.name.toLowerCase().includes(dialogSearch.toLowerCase()));
  }, [availableTags, dialogSearch]);

  const handleAdd = async () => {
    const trimmed = (newTag || '').trim();
    if (!trimmed) return;
    if (onAddTag) await onAddTag(trimmed);
    setNewTag('');
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          <List className="h-4 w-4 mr-2" />
          Browse
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {inlineFiltered.map(tag => {
          const isSelected = selectedTags?.includes(tag.name);
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? 'default' : 'outline'}
              className={`cursor-pointer ${isSelected ? 'ring-1 ring-offset-1' : 'hover:bg-slate-100'}`}
              onClick={() => onToggleTag && onToggleTag(tag.name)}
            >
              {tag.name}
            </Badge>
          );
        })}
      </div>

      {/* Dialog: full list + search + add */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Tags</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input value={dialogSearch} onChange={(e) => setDialogSearch(e.target.value)} className="pl-10" placeholder="Filter tags..." />
              </div>
              <div className="flex items-center gap-2">
                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag" />
                <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <div className="max-h-64 overflow-auto border rounded p-2 grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
              {dialogFiltered.map(tag => (
                <div key={tag.id} className="flex items-center">
                  <Badge
                    variant={selectedTags?.includes(tag.name) ? 'default' : 'outline'}
                    className="cursor-pointer w-full text-left"
                    onClick={() => onToggleTag && onToggleTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagSelector;
