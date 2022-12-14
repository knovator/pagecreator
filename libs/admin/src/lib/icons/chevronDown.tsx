import React from 'react';
import { IconProps } from '../types';

const ChevronDown = ({ srText, className }: IconProps) => {
  return (
    <>
      {srText ? <span className="khb_sr-only">{srText}</span> : null}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-5 -8 24 24"
        width="24"
        fill="currentColor"
        className={className}
      >
        <path d="M7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364l4.95 4.95z"></path>
      </svg>
    </>
  );
};

export default ChevronDown;
