import React from 'react';
import { IconProps } from '../types';

const Settings = ({ srText, className }: IconProps) => {
  return (
    <>
      {srText ? <span className="khb_sr-only">{srText}</span> : null}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="24"
        height="24"
        fill="none"
        className={className}
      >
        <g clipPath="url(#clip0_33400_61483)">
          <path
            d="M3.33203 3.33301H16.6654V5.14301C16.6653 5.585 16.4896 6.00885 16.177 6.32134L12.4987 9.99967V15.833L7.4987 17.4997V10.4163L3.76536 6.30967C3.48657 6.00295 3.33208 5.60334 3.33203 5.18884V3.33301Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_33400_61483">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default Settings;
