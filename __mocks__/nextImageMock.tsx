import React from 'react';

const Image = ({
  src,
  alt,
  priority,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  priority?: boolean;
}) => <img src={src} alt={alt} {...(priority ? { fetchpriority: 'high' } : {})} {...props} />;

export default Image;
