import React from "react";
import Button from "../../common/Button";
import { usePageState } from "../../../context/PageContext";

const AddButton = () => {
	const { onChangeFormState, t, canAdd } = usePageState();
	return (
		<Button disabled={!canAdd} onClick={() => onChangeFormState("ADD")}>
			{t("addButtonText")}
		</Button>
	);
};

export default AddButton;
