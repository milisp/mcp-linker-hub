'use client';

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type ImageItem = {
  src: string;
  alt: string;
  blurDataURL: string;
};

const images: ImageItem[] = [
  { src: "/images/Home.png", alt: "Home screenshot", blurDataURL: "data:image/jpeg;base64,/9j/4gIUSUNDX1BST0ZJTEUAAQEAAAIEYXBwbAQAAABtbnRyUkdCIFhZWiAH6QAFAB8ABwAoAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGyY+NbVk+S1wPLodIJ2/YDzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAACpjcHJ0AAABKAAAAFB3dHB0AAABeAAAABRyWFlaAAABjAAAABRnWFlaAAABoAAAABRiWFlaAAABtAAAABRyVFJDAAAByAAAABBjaGFkAAAB2AAAACxiVFJDAAAByAAAABBnVFJDAAAByAAAABBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAA4AAAAcAE0AMgAzADcAVwBBAFAAAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAANAAAABwAQwBvAHAAeQByAGkAZwBoAHQAIABBAHAAcABsAGUAIABJAG4AYwAuACwAIAAyADAAMgA1WFlaIAAAAAAAAPbWAAEAAAAA0y1YWVogAAAAAAAAeDYAAD4SAAAClVhZWiAAAAAAAABZpwAArfsAABUvWFlaIAAAAAAAACT5AAAT8wAAu2hwYXJhAAAAAAAAAAAAAfYEc2YzMgAAAAAAAQu3AAAFlv//81cAAAcpAAD91///+7f///2mAAAD2gAAwPb//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAgUFBcUFxsbGxsbGyAeICEhISAgICAhISEkJCQqKiokJCQhISQkKCgqKi4vLisrKisvLzIyMjw8OTlGRkhWVmf/xABlAAEBAAAAAAAAAAAAAAAAAAAGAwEAAwEAAAAAAAAAAAAAAAAAAAMCBBAAAQIGAgMBAAAAAAAAAAAAAgERMRIAIgQDsTJxcmFBEQACAgIDAQAAAAAAAAAAAAAAAQIRkXEDsSFR/8AAEQgABgAKAwESAAISAAMSAP/aAAwDAQACEQMRAD8ATpk4ZgDjuRZRS1hgPw6Fh1DwnFao8jiqSi9xT7MoLwCezfjzkybGmWMrx/bqMH3L2XmmuTfzCFF3rBB//9k="

   },
  { src: "/images/AddServer.png", alt: "Add Server", blurDataURL: "/9j/4gIUSUNDX1BST0ZJTEUAAQEAAAIEYXBwbAQAAABtbnRyUkdCIFhZWiAH6QAFAB8ABwAoAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGyY+NbVk+S1wPLodIJ2/YDzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAACpjcHJ0AAABKAAAAFB3dHB0AAABeAAAABRyWFlaAAABjAAAABRnWFlaAAABoAAAABRiWFlaAAABtAAAABRyVFJDAAAByAAAABBjaGFkAAAB2AAAACxiVFJDAAAByAAAABBnVFJDAAAByAAAABBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAA4AAAAcAE0AMgAzADcAVwBBAFAAAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAANAAAABwAQwBvAHAAeQByAGkAZwBoAHQAIABBAHAAcABsAGUAIABJAG4AYwAuACwAIAAyADAAMgA1WFlaIAAAAAAAAPbWAAEAAAAA0y1YWVogAAAAAAAAeDYAAD4SAAAClVhZWiAAAAAAAABZpwAArfsAABUvWFlaIAAAAAAAACT5AAAT8wAAu2hwYXJhAAAAAAAAAAAAAfYEc2YzMgAAAAAAAQu3AAAFlv//81cAAAcpAAD91///+7f///2mAAAD2gAAwPb//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAgUFBcUFxsbGxsbGyAeICEhISAgICAhISEkJCQqKiokJCQhISQkKCgqKi4vLisrKisvLzIyMjw8OTlGRkhWVmf/xABYAAEBAQAAAAAAAAAAAAAAAAAEBQYBAQAAAAAAAAAAAAAAAAAAAAAQAAIABgMBAQAAAAAAAAAAAAIBMQARIXEDBDIiQVERAQAAAAAAAAAAAAAAAAAAAAD/wAARCAAGAAoDARIAAhIAAxIA/9oADAMBAAIRAxEAPwA2jn8bXoYFpZESsVB8+aWvWM4NQWFIAk9wMis4v4v3MxS7PLkA/9k=" },
  { src: "/images/Manage.png", alt: "Manage Server", blurDataURL: "/9j/4gIUSUNDX1BST0ZJTEUAAQEAAAIEYXBwbAQAAABtbnRyUkdCIFhZWiAH6QAFAB8ABwAoAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGyY+NbVk+S1wPLodIJ2/YDzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAACpjcHJ0AAABKAAAAFB3dHB0AAABeAAAABRyWFlaAAABjAAAABRnWFlaAAABoAAAABRiWFlaAAABtAAAABRyVFJDAAAByAAAABBjaGFkAAAB2AAAACxiVFJDAAAByAAAABBnVFJDAAAByAAAABBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAA4AAAAcAE0AMgAzADcAVwBBAFAAAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAANAAAABwAQwBvAHAAeQByAGkAZwBoAHQAIABBAHAAcABsAGUAIABJAG4AYwAuACwAIAAyADAAMgA1WFlaIAAAAAAAAPbWAAEAAAAA0y1YWVogAAAAAAAAeDYAAD4SAAAClVhZWiAAAAAAAABZpwAArfsAABUvWFlaIAAAAAAAACT5AAAT8wAAu2hwYXJhAAAAAAAAAAAAAfYEc2YzMgAAAAAAAQu3AAAFlv//81cAAAcpAAD91///+7f///2mAAAD2gAAwPb//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAgUFBcUFxsbGxsbGyAeICEhISAgICAhISEkJCQqKiokJCQhISQkKCgqKi4vLisrKisvLzIyMjw8OTlGRkhWVmf/xABZAAEBAQAAAAAAAAAAAAAAAAAGBAcBAQAAAAAAAAAAAAAAAAAAAAAQAAEDAwUBAQAAAAAAAAAAAAIDBAFyACFxUUKxMhMSEQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgABgAKAwESAAISAAMSAP/aAAwDAQACEQMRAD8Adov2kJhHyLAjwDaq87T8DTHVgFSrtvKhz+JyRcR31sgp7Kqe7AP/2Q==" },
];

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, []);

  const next = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  return (
    <section className="container px-4 py-8 max-w-5xl mx-auto">
      {/* Main carousel container */}
      <div className="relative">
        {/* Image container with optimized aspect ratio for 1392x880 */}
        <div className="relative w-full aspect-[174/110] max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
          <Image
            src={images[index].src}
            alt={images[index].alt}
            placeholder="blur"
            blurDataURL={images[index].blurDataURL}
            fill
            className="object-contain transition-opacity duration-500"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          />
          
          {/* Navigation buttons */}
          <button 
            onClick={prev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={next}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i === index 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Image caption */}
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            {images[index].alt}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {index + 1} / {images.length}
          </p>
        </div>
      </div>
    </section>
  );
}