import classNames from 'classnames';

const Checkbox = ({
  rest,
  label,
  error,
  wrapperClassName,
  disabled,
}: CheckboxProps) => {
  return (
    <div className={classNames('khb_input-wrapper', wrapperClassName)}>
      {label && <label className="khb_input-label">{label}</label>}
      <label className="khb_switch" data-testid="khb_switch">
        <input type="checkbox" disabled={disabled} {...rest} />
        <span className="slider round" />
      </label>
      {error && <p className="khb_input-error">{error}</p>}
    </div>
  );
};

export default Checkbox;
