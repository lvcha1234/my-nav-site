import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { NavLink } from '@/types';

interface SiteItemProps {
  link: NavLink;
}

function getFaviconSrc(link: NavLink): string | null {
  if (link.favicon) {
    if (link.favicon.startsWith('data:') || link.favicon.startsWith('http')) {
      return link.favicon;
    }
    return `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`;
  }
  return null;
}

function getFirstChar(name: string): string {
  return name.charAt(0).toUpperCase();
}

export default function SiteItem({ link }: SiteItemProps) {
  const { isAdmin, setEditingLink, deleteLink } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const faviconSrc = getFaviconSrc(link);

  const handleClick = () => {
    window.open(link.url, '_blank');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLink(link);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteLink(link.id);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.05 }}
      className="relative flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer group transition-shadow"
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-card-hover)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Favicon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--glass-bg)' }}
      >
        {faviconSrc ? (
          <img
            src={faviconSrc}
            alt={link.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span
          className={`text-lg font-medium ${faviconSrc ? 'hidden' : ''}`}
          style={{ color: 'var(--accent)' }}
        >
          {getFirstChar(link.name)}
        </span>
      </div>

      {/* Name */}
      <span
        className="text-xs text-center truncate w-full"
        style={{ color: 'var(--text-secondary)' }}
      >
        {link.name}
      </span>

      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1 rounded"
            style={{ color: 'var(--text-muted)' }}
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded"
            style={{ color: 'var(--text-muted)' }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
