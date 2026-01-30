import React from "react";
import Button from "../../common/Button";
import { useWidgetState } from "../../../context/WidgetContext";
import { useProviderState } from '../../../context/ProviderContext';

const AddButton = () => {
  const { commonTranslations } = useProviderState();
  const { onChangeFormState, canAdd } = useWidgetState();
  return (
    <Button disabled={!canAdd} onClick={() => onChangeFormState('ADD')}>
      {commonTranslations.add}
    </Button>
  );
};

export default AddButton;
