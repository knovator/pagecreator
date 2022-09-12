import { FormWrapperProps } from '../../../types';
import { useWidgetState } from '../../../context/WidgetContext';

const WiddgetFormWrapper = ({ children }: FormWrapperProps) => {
  const { formState, closeForm } = useWidgetState();

  return typeof children === 'function'
    ? children({
        formState,
        onClose: closeForm,
        open: formState === 'ADD' || formState === 'UPDATE',
      })
    : null;
};

export default WiddgetFormWrapper;
