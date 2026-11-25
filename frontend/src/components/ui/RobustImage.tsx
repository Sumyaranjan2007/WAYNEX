'use client';

import React, { useState } from 'react';

interface RobustImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  categoryHint?: string;
  stateSlug?: string;
}

export const RobustImage: React.FC<RobustImageProps> = ({
  src,
  alt = 'WAYNEX image',
  className = '',
  fallbackSrc,
  categoryHint,
  stateSlug,
  ...props
}) => {
  // Determine resilient local asset path
  const localDefault = stateSlug ? `/images/states/${stateSlug}.svg` : '/images/states/odisha.svg';
  const effectiveFallback = fallbackSrc || localDefault;

  const [imgSrc, setImgSrc] = useState<string>(src as string || effectiveFallback);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Route immediately to guaranteed local vector asset
      setImgSrc(effectiveFallback);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-navy-950 flex items-center justify-center">
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${hasError ? 'opacity-95 saturate-100' : 'opacity-100'} ${className}`}
        {...props}
      />
    </div>
  );
};
