import {
  AvatarFallback,
  AvatarImage,
  Avatar as RadixAvatar,
} from '@/components/ui/avatar';
import React, { useMemo, useState } from 'react';

export const AVATAR_COLORS = [
  { bg: '#1A57BF1A', color: '#1A57BF' }, // Orange
  { bg: '#34AD4426', color: '#34AD44' }, // Green
  { bg: '#00A8BF26', color: '#00A8BF' }, // Blue
  { bg: '#90C91D26', color: '#90C91D' }, // Red
  { bg: '#EBB40226', color: '#EBB402' }, // Bright Green
  { bg: '#D4323226', color: '#D43232' }, // Teal
  { bg: '#FF6B3526', color: '#FF6B35' }, // Brown
];

export interface AvatarProps {
  name: string;
  image?: string;
  placeholderImage?: string;
  height?: number | string;
  width?: number | string;
  className?: string;
  avatarColor?: { bg: string; color: string } | undefined;
  style?: React.CSSProperties;
  swapColors?: boolean;
  autoTextColor?: boolean;
}

// Function to calculate relative luminance of a color
function getLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  // Calculate relative luminance
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance;
}

// Function to get contrasting text color
function getContrastingTextColor(bgColor: string): string {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function getRandomAvatarColor(
  name: string,
  avatarColor?: { bg: string; color: string },
  swapColors: boolean = false,
  autoTextColor: boolean = false
) {
  const colorArray = AVATAR_COLORS ?? [];
  if (avatarColor) {
    let result = avatarColor;
    if (swapColors) {
      result = { bg: avatarColor.color, color: avatarColor.bg };
    }
    if (autoTextColor) {
      result = { bg: result.bg, color: getContrastingTextColor(result.bg) };
    }
    return result;
  }
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
    const selectedColor = colorArray[idx] ?? { bg: '#ccc', color: '#222' };

    let result = selectedColor;
    if (swapColors) {
      result = { bg: selectedColor.color, color: selectedColor.bg };
    }
    if (autoTextColor) {
      result = { bg: result.bg, color: getContrastingTextColor(result.bg) };
    }
    return result;
  }
  return { bg: '#ccc', color: '#222' };
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  image,
  placeholderImage,
  height = 80,
  width = 80,
  className = '',
  avatarColor,
  style = {},
  swapColors = false,
  autoTextColor = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [placeholderError, setPlaceholderError] = useState(false);
  const color = useMemo(
    () => getRandomAvatarColor(name, avatarColor, swapColors, autoTextColor),
    [name, avatarColor, swapColors, autoTextColor]
  );

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters
  };

  // Determine if we should show the fallback (initials)
  const shouldShowFallback =
    !image || imgError || (placeholderImage && placeholderError);

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
          style={{
            backgroundColor: color.bg ?? '#ccc',
            color: color.color ?? '#222',
          }}
          onError={() => setImgError(true)}
        />
      ) : placeholderImage && !placeholderError ? (
        <AvatarImage
          src={placeholderImage}
          alt='placeholder'
          className='rounded-[10px] object-cover text-6 font-bold'
          style={{
            backgroundColor: color.bg ?? '#ccc',
            color: color.color ?? '#222',
          }}
          onError={() => setPlaceholderError(true)}
        />
      ) : null}

      {/* Always render fallback, it will show when image fails or doesn't exist */}
      <AvatarFallback
        className='rounded-[10px] object-cover text-6 font-bold'
        style={{
          backgroundColor: color.bg ?? '#ccc',
          color: color.color ?? '#222',
        }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </RadixAvatar>
  );
};
