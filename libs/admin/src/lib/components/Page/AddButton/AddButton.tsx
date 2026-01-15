import React from "react";
import Button from "../../common/Button";
import { usePageState } from "../../../context/PageContext";
import { useProviderState } from '../../../context/ProviderContext';

const AddButton = () => {
  const { commonTranslations } = useProviderState();
  const { onChangeFormState, canAdd } = usePageState();
  return (
    <Button disabled={!canAdd} onClick={() => onChangeFormState('ADD')}>
      {commonTranslations.add}
    </Button>
  );
};

export default AddButton;
