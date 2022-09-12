import { FormWrapperProps } from '../../../types';
import { usePageState } from '../../../context/PageContext';

const PageFormWrapper = ({ children }: FormWrapperProps) => {
  const { formState, closeForm } = usePageState();

  return typeof children === 'function'
    ? children({
        formState,
        onClose: closeForm,
        open: formState === 'ADD' || formState === 'UPDATE',
      })
    : null;
};

export default PageFormWrapper;
