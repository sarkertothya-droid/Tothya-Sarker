import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { storeSettings } = useStore();

  if (!storeSettings.showAnnouncement || !storeSettings.announcementText) {
    return null;
  }

  return (
    <div className="bg-[#1C1A18] text-[#E8E2D5] px-4 py-2.5 text-xs text-center border-b border-[#2D2A26] tracking-wide flex items-center justify-center gap-2">
      <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
      <span className="font-medium truncate">{storeSettings.announcementText}</span>
    </div>
  );
};
