import Checkbox from "./Checkbox";
import Input from "./Input";
import Select from "./Select";
import ReactSelect from "./ReactSelect";
import SrcSet from './SrcSet';

export default Object.assign<
  typeof Input,
  {
    Select: typeof Select;
    ReactSelect: typeof ReactSelect;
    Checkbox: typeof Checkbox;
    SrcSet: typeof SrcSet;
  }
>(Input, {
  Select,
  ReactSelect,
  Checkbox,
  SrcSet,
});
