import { ToggleProps } from 'libs/admin/src/types';

const Toggle = ({ isChecked, disabled, onChange }: ToggleProps) => {
  return (
    <label className="khb_switch" data-testid="khb_switch">
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
