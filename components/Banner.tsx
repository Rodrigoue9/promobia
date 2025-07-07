import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BannerContent } from '../types';
import { api } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner: React.FC = () => {
  const [banners, setBanners] = useState<BannerContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
        const data = await api.fetchBanners();
        setBanners(data);
    };
    fetchBanners();
  }, []);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, banners.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, banners.length]);
  
  useEffect(() => {
    if (banners.length > 1) {
        const timer = setTimeout(goToNext, 5000); // Auto-play
        return () => clearTimeout(timer);
    }
  }, [currentIndex, banners, goToNext]);

  if (banners.length === 0) {
      return (
          <div className="relative bg-slate-700 rounded-lg my-8 h-80 animate-pulse"></div>
      );
  }

  const currentBanner = banners[currentIndex];

  const handleControlClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  
  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-8 shadow-2xl h-80 group" aria-roledescription="carousel">
      <Link to={currentBanner.link} aria-label={`Promoção: ${currentBanner.title}`} className="block w-full h-full">
        {/* Background Images */}
        <div className="w-full h-full">
          {banners.map((banner, index) => (
              <div key={banner.id} aria-hidden={index !== currentIndex} className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                  <img src={banner.image} alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/20"></div>
              </div>
          ))}
        </div>
        
        {/* Foreground Content */}
        <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-center items-center text-white text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg transition-transform duration-300 group-hover:scale-105">{currentBanner.title}</h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-slate-200 drop-shadow-md">
            {currentBanner.subtitle}
          </p>
          <div className="mt-8">
              {/* This is just a visual cue, not a real button */}
              <span className="inline-flex items-center justify-center rounded-md font-medium text-lg px-8 py-3 bg-primary-600 text-white transition-all duration-300 group-hover:bg-primary-700 group-hover:scale-110">
                  {currentBanner.buttonText}
              </span>
          </div>
        </div>
      </Link>
      
      {/* Controls */}
      {banners.length > 1 && (
        <>
            <button 
                onClick={(e) => handleControlClick(e, goToPrevious)} 
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Banner anterior"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={(e) => handleControlClick(e, goToNext)} 
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Próximo banner"
            >
                <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {banners.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={(e) => handleDotClick(e, index)} 
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                        aria-label={`Ir para o banner ${index + 1}`}
                    ></button>
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default Banner;