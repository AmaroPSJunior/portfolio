'use client';

import React from 'react';

interface NodeIconProps {
  icon?: string;
  iconUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-9 w-9',
};

export const NodeIcon: React.FC<NodeIconProps> = ({
  icon,
  iconUrl,
  size = 'md',
  alt = '',
  className = '',
}) => {
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${sizes[size]} object-contain ${className}`}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  if (icon?.startsWith('http')) {
    return (
      <img
        src={icon}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${sizes[size]} object-contain ${className}`}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <span className={className}>
      {icon || '◉'}
    </span>
  );
};
