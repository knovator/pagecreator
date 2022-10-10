import { IconProps } from '../types';

const Plus = ({ srText, className }: IconProps) => {
  return (
    <>
      {srText ? <span className="khb_sr-only">{srText}</span> : null}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        width="24"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    </>
  );
};

export default Plus;
