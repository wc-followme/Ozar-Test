interface ShieldPlusIconProps {
  className?: string;
}

export default function ShieldPlusIcon({
  className = '',
}: ShieldPlusIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      className={className}
    >
      <g clipPath='url(#clip0_3911_27770)'>
        <path
          d='M9 12H15'
          stroke='currentcolor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12 9V15'
          stroke='currentcolor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M20.25 10.5V5.25C20.25 5.05109 20.171 4.86032 20.0303 4.71967C19.8897 4.57902 19.6989 4.5 19.5 4.5H4.5C4.30109 4.5 4.11032 4.57902 3.96967 4.71967C3.82902 4.86032 3.75 5.05109 3.75 5.25V10.5C3.75 19.5 12 21.75 12 21.75C12 21.75 20.25 19.5 20.25 10.5Z'
          stroke='currentcolor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_3911_27770'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}
