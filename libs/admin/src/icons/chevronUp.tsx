import { IconProps } from '../types';

const ChevronUp = ({ srText, className }: IconProps) => {
  return (
    <>
      {srText ? <span className="khb_sr-only">{srText}</span> : null}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-5 -7.5 24 24"
        width="24"
        fill="currentColor"
        className={className}
      >
        <path d="M7.071 2.828l-4.95 4.95A1 1 0 0 1 .707 6.364L6.364.707a1 1 0 0 1 1.414 0l5.657 5.657a1 1 0 0 1-1.414 1.414l-4.95-4.95z"></path>
      </svg>
    </>
  );
};

export default ChevronUp;
