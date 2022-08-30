import classNames from 'classnames';
import React from 'react';
import ChevronDown from '../../../icons/chevronDown';
import ChevronUp from '../../../icons/chevronUp';

interface AccordianProps {
  id?: string;
  collapseId?: string;
  className?: string;
  children?: React.ReactNode;
  open?: boolean;
  onToggle?: (status: boolean) => void;
  title?: string;
  footerContent?: React.ReactNode;
}

const Accordian = ({
  id,
  className,
  children,
  open,
  onToggle,
  title,
  collapseId,
  footerContent,
}: AccordianProps) => {
  return (
    <div>
      <h2 id={id}>
        <button
          type="button"
          className="khb_accordian-header"
          data-accordion-target={`#${collapseId}`}
          aria-expanded="true"
          aria-controls={collapseId}
          onClick={() => onToggle && onToggle(!open)}
        >
          <span>{title}</span>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </h2>
      <div
        id={collapseId}
        className={classNames('khb_accordian-body', { hidden: !open })}
        aria-labelledby={id}
      >
        <div className="khb_accordian-content">{children}</div>
        {footerContent && (
          <div className="khb_accordian-footer">{footerContent}</div>
        )}
      </div>
    </div>
  );
};

export default Accordian;
