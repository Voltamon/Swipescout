import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/UI/dialog.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { useNavigate } from 'react-router-dom';

export default function OpenChatModal({ open, onOpenChange, conversation }) {
  const navigate = useNavigate();
  if (!conversation) return null;
  const other = conversation.other_user || conversation.other_user || conversation.otherUser || conversation.other;

  const handleOpenChat = () => {
    onOpenChange(false);
    navigate(`/chat/${conversation.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conversation ready</DialogTitle>
          <DialogDescription>
            Your connection is accepted — you can now open a chat with {other?.displayName || other?.firstName || 'them'}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={other?.photoUrl || other?.profile_image || other?.photo_url} />
              <AvatarFallback>{(other?.displayName || other?.firstName || 'U')?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{other?.displayName || other?.firstName || 'User'}</div>
              <div className="text-sm text-muted-foreground">{other?.title || ''}</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleOpenChat}>Open Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
