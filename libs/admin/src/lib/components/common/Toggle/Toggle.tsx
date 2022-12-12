import React from 'react';
import { ToggleProps } from '../../../types';

const Toggle = ({
  isChecked,
  disabled,
  onChange,
  switchClass,
}: ToggleProps) => {
  return (
    <label className={switchClass || 'khb_switch'} data-testid="khb_switch">
      <input
        type="checkbox"
        onChange={() => onChange && onChange(!isChecked)}
        checked={isChecked}
        disabled={disabled}
      />
      <span className="slider round" />
    </label>
  );
};

export default Toggle;
