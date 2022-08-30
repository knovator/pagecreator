import Checkbox from "./Checkbox";
import Input from "./Input";
import Select from "./Select";
import ReactSelect from "./ReactSelect";
// import Textarea from "./Textarea"

export default Object.assign<
	typeof Input,
	{ Select: typeof Select; ReactSelect: typeof ReactSelect; Checkbox: typeof Checkbox }
>(Input, {
	Select,
	ReactSelect,
	Checkbox,
});
