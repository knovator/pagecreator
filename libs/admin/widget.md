<div id="top"></div>

## Widget
Avails facility to `list`/`create`/`update`/`delete` records for widget
```jsx
import { Provider, Widget } from '@knovator/pagecreator-admin`;

function App() {
    return (
        <Provider
            ...
        >
            <Widget />
        </Provider>
    )
}
```
**Props**
- `t` (optional)
    - translation
- `loader` (optional)
    - Loader to show while loading
- `routes` (optional): 
    - Custom routes to implement according to [data-formats.md#routes_input](data-formats.md#routes_input)
- `explicitForm` (optional)
    - Boolean value indicates use of external form if true
- `permissions` (optional)
    - Accepts key-value pair for  [permissions](data-formats.md#permissions)
- `formatListItem` (optional): `(code: string, data: any) => JSX.Element`
    - Function to format collection item
- `formatOptionLabel` (optional): `(code: string, data: any) => JSX.Element`
    - Function to format collection option
- `preConfirmDelete` (optional): `(data: { row: ObjectType }) => Promise<boolean>;`
    - Function to call before deleting any item


<p align="right">(<a href="#top">back to top</a>)</p>

### Widget.Table
- Avails facility to show `Table` component for Widget explicitly.
```jsx
    <Widget>
        <Widget.Table />
    </Widget>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Widget.Pagination
- Avails facility to show `Pagination` component for Widget explicitly.
```jsx
    <Widget>
        <Widget.Table />
        <Widget.Pagination />
    </Widget>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Widget.Search
- Avails facility to show `Search` component for Widget explicitly.
- Searches records in widget, as user starts typing
```jsx
    <Widget>
        <Widget.Search />
    </Widget>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Widget.AddButton
- Avails facility to open `Form`, when clicked
```jsx
    <Widget>
        <Widget.AddButton />
    </Widget>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Widget.FormWrapper
- Avails facility to access form parameters, to use when `explicitForm` is true for `Widget`
```jsx
    <Widget
        explicitForm={true}
    >
        <Widget.FormWrapper>
            {({ formState, onClose, open }) => (
                ...
            )}
        </Widget.FormWrapper>
    </Widget>
```
- Possible form-states are mentioned in [data-formats.md#formstate](data-formats.md#formstate)
<p align="right">(<a href="#top">back to top</a>)</p>

### Widget.FormActions
- Avails facility to show `FormActions`, to be used inside `FormWrapper` along with `Form`. Required to provide `formRef`.
```jsx
    const formRef = React.createRef();
    
    // return
    <Widget
        explicitForm={true}
    >
        <Widget.FormWrapper>
            {({ formState, onClose, open }) => (
                <>
                    <Widget.Form ref={formRef} />
                    <Widget.FormActions formRef={formRef} />
                </>
            )}
        </Widget.FormWrapper>
    </Widget>
``` 
<p align="right">(<a href="#top">back to top</a>)</p>

### Widget.Form
- Avails facility to show `Form`, to be used inside `FormWrapper` along with `FormActions`. Required to provide `formRef`.
```jsx
    const formRef = React.createRef();
    
    // return
    <Widget
        explicitForm={true}
    >
        <Widget.FormWrapper>
            {({ formState, onClose, open }) => (
                <>
                    <Widget.Form formRef={formRef} />
                    <Widget.FormActions formRef={formRef} />
                </>
            )}
        </Widget.FormWrapper>
    </Widget>
```
<p align="right">(<a href="#top">back to top</a>)</p>