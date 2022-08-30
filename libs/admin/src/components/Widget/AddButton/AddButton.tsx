import React from "react";
import Button from "../../common/Button";
import { useWidgetState } from "../../../context/WidgetContext";

const AddButton = () => {
	const { onChangeFormState, t, canAdd } = useWidgetState();
	return (
		<Button disabled={!canAdd} onClick={() => onChangeFormState("ADD")}>
			{t("addButtonText")}
		</Button>
	);
};

export default AddButton;
