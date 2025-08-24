import { useState } from "react";

interface ImageSliderProps {
  images: string[];
  title: string;
}

const ImageSlider = ({ images, title }: ImageSliderProps) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;
  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={images[current]}
        alt={`${title} ${current + 1}`}
        className="w-full h-full object-cover rounded-md"
        style={{ maxHeight: 400 }}
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
            aria-label="Previous image"
          >
            &#8592;
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
            aria-label="Next image"
          >
            &#8594;
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`inline-block w-2 h-2 rounded-full ${
                  idx === current ? "bg-teal-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
