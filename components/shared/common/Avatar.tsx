import {
  AvatarFallback,
  AvatarImage,
  Avatar as RadixAvatar,
} from '@/components/ui/avatar';
import React, { useMemo, useState } from 'react';

export const AVATAR_COLORS = [
  { bg: '#1A57BF1A', color: '#24338C' }, // Orange
  { bg: '#34AD4426', color: '#34AD44' }, // Green
  { bg: '#00A8BF26', color: '#00A8BF' }, // Blue
  { bg: '#90C91D26', color: '#90C91D' }, // Red
  { bg: '#EBB40226', color: '#EBB402' }, // Bright Green
  { bg: '#D4323226', color: '#D43232' }, // Teal
  { bg: '#F58B1E1A', color: '#F58B1E' }, // Brown
];

export interface AvatarProps {
  name: string;
  image?: string;
  height?: number | string;
  width?: number | string;
  className?: string;
  avatarColor?: { bg: string; color: string } | undefined;
  style?: React.CSSProperties;
}

export function getRandomAvatarColor(
  name: string,
  avatarColor?: { bg: string; color: string }
) {
  const colorArray = AVATAR_COLORS ?? [];
  if (avatarColor) return avatarColor;
  if (
    colorArray.length > 0 &&
    typeof name === 'string' &&
    name.trim().length > 0
  ) {
    const trimmed = name.trim();
    const firstChar = trimmed.length > 0 ? trimmed[0] : '';
    if (!firstChar) return { bg: '#ccc', color: '#222' };
    const charCode = firstChar.charCodeAt(0);
    const idx = charCode % colorArray.length;
    return colorArray[idx] ?? { bg: '#ccc', color: '#222' };
  }
  return { bg: '#ccc', color: '#222' };
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  image,
  height = 80,
  width = 80,
  className = '',
  avatarColor,
  style = {},
}) => {
  const [imgError, setImgError] = useState(false);
  const color = useMemo(
    () => getRandomAvatarColor(name, avatarColor),
    [name, avatarColor]
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <RadixAvatar
      className={`rounded-[10px] ${className}`}
      style={{ height, width, ...style }}
    >
      {image && !imgError ? (
        <AvatarImage
          src={image}
          alt={name}
          className='rounded-[10px] object-cover text-6 font-bold'
          onError={() => setImgError(true)}
          style={{
            background: color.bg ?? '#ccc',
            color: color.color ?? '#222',
          }}
        />
      ) : (
        <AvatarImage
          src='/images/img-placeholder-sm.png'
          alt='placeholder'
          className='rounded-[10px] object-cover text-6 font-bold'
          style={{
            background: color.bg ?? '#ccc',
            color: color.color ?? '#222',
          }}
        />
      )}
      <AvatarFallback
        className='rounded-[10px] object-cover text-6 font-bold'
        style={{
          background: color.bg ?? '#ccc',
          color: color.color ?? '#222',
        }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </RadixAvatar>
  );
};
