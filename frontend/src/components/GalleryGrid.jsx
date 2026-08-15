import React from 'react';

export default function GalleryGrid({ items }) {
  if (!items?.length) {
    return <p className="text-center text-onyx/50 dark:text-white/50 py-10">No gallery items yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item._id} className="relative rounded-xl overflow-hidden aspect-square group card">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div>
              <p className="text-white text-sm font-medium">{item.title}</p>
              <p className="text-gold-light text-xs">{item.category}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
