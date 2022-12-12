## Data Formats

### `Routes_Input`
- Accepts Object with key as `ACTION_TYPES` and value as funcion
- Function provides avails parameters
    - `prefix` => `widgetRoutesPrefix`, `itemsRoutesPrefix` or `pageRoutesPrefix`
    - `id` => id of record, in case of update/delete
- Function need following parameters in return
    - `url` => relative url like `/admin/widget/update`
    - `method` => HTTP method like **GET**, **POST**, **PUT**, **DELETE** etc.

### `Permissions`
- Allows providing following permissions for Page/Widget
    - `list` => Can user see data
    - `sequencing` => Can user change item sequence
    - `add` => Can user add new record
    - `update` => Can user update record
    - `partialUpdate` => Can user do partial update like change in `isActive`
    - `destroy` => Can user delete record

### `FormState`
- `ADD` => Adding Record
- `UPDATE` => Updating Record
- `DELETE` => Deleting Record
- `''` => Nothing selected