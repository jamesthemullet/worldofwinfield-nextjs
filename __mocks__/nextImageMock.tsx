import React from 'react';

const Image = ({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) => (
  <img src={src} alt={alt} {...props} />
);

export default Image;
