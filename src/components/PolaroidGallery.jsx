import React from 'react';

const memories = [
  {
    src: '/photos/moment-1.png',
    alt: 'Doctor Saheba and Om smiling together',
    caption: 'Where our friendship began',
    date: 'Our first Photo',
    tilt: '-2.4deg'
  },
  {
    src: '/photos/moment-2.jpeg',
    alt: 'Doctor Saheba and Om in festive attire smiling together',
    caption: 'Partner in countless stupid conversations 😂',
    date: 'Through the Years',
    tilt: '1.8deg'
  },
  {
    src: '/photos/moment-3.jpg',
    alt: 'Doctor Saheba and Om in traditional outfits',
    caption: 'My comfort person & safe place 🫶🏻',
    date: 'Always Beside Me',
    tilt: '-1.5deg'
  },
  {
    src: '/photos/moment-4.jpg',
    alt: 'Doctor Saheba and Om together outdoors',
    caption: 'Our friendship will stay ♾️',
    date: '7 Years & Forever',
    tilt: '2.2deg'
  }
];

const PolaroidGallery = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="unclickable-modal-backdrop active" onClick={onClose}>
      <div 
        className="relative max-w-4xl w-full bg-white/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-pink-200 shadow-2xl overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="unclickable-close-btn"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-pink-500 font-semibold bg-pink-100/80 px-3 py-1 rounded-full border border-pink-200">
            BIRTHDAY CELEBRATION • BORN 18 OCTOBER 2006 • 7 YEARS OF US
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-dancingScript text-rose-600 mt-2">
            Happy Birthday Doctor Saheba! Moments We Treasure 🎂🫂❤️
          </h2>
          <p className="text-sm text-gray-600 italic mt-1">
            "Celebrating your birthday and seven unforgettable years of shared laughter, comfort, and memories."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {memories.map((m, idx) => (
            <article
              key={idx}
              className="bg-white p-3 rounded-lg shadow-md border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col justify-between"
              style={{ transform: `rotate(${m.tilt})` }}
            >
              <div className="w-full aspect-square overflow-hidden rounded bg-gray-50 mb-3 border border-pink-100">
                <img
                  src={m.src}
                  alt={m.alt}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="font-dancingScript text-base text-gray-800 leading-snug font-semibold text-center">
                  {m.caption}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-pink-500 text-center mt-1 font-medium">
                  {m.date}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center border-t border-pink-100 pt-4">
          <p className="text-xs text-gray-500 italic">
            Seven years of friendship, endless laughter, and unconditional care • <span className="text-pink-600 font-medium">Om & Doctor Saheba ♾️</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolaroidGallery;
