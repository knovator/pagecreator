import React from 'react';
import classNames from 'classnames';
import { ButtonProps } from 'libs/admin/src/types';

const Button = ({
  type = 'primary',
  size = 'base',
  onClick,
  className,
  children,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        'khb_btn',
        `khb_btn-${type}`,
        `khb_btn-${size}`,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
