<div id="top"></div>

## Page
Avails facility to `list`/`create`/`update`/`delete` records for page
```jsx
import { Provider, Page } from '@knovator/pagecreator-admin`;

function App() {
    return (
        <Provider
            ...
        >
            <Page />
        </Provider>
    )
}
```
**Props**
- `t` (optional)
    - translation
- `loader` (optional)
    - Loader to show while loading
- `explicitForm` (optional)
    - Boolean value indicates use of external form if true
- `permissions` (optional)
    - Accepts key-value pair for  [permissions](data-formats.md#permissions)

<p align="right">(<a href="#top">back to top</a>)</p>

### Page.Table
- Avails facility to show `Table` component for Page explicitly.
```jsx
    <Page>
        <Page.Table />
    </Page>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Page.Pagination
- Avails facility to show `Pagination` component for Page explicitly.
```jsx
    <Page>
        <Page.Table />
        <Page.Pagination />
    </Page>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Page.Search
- Avails facility to show `Search` component for Page explicitly.
- Searches records in page, as user starts typing
```jsx
    <Page>
        <Page.Search />
    </Page>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Page.AddButton
- Opens `Form`, when clicked
```jsx
    <Page>
        <Page.AddButton />
    </Page>
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Page.FormWrapper
- Avails facility to access form parameters, to use when `explicitForm` is true for `Page`
```jsx
    <Page
        explicitForm={true}
    >
        <Page.FormWrapper>
            {({ formState, onClose, open }) => (
                ...
            )}
        </Page.FormWrapper>
    </Page>
```
- Possible form-states are mentioned in [data-formats.md#formstate](data-formats.md#formstate)
<p align="right">(<a href="#top">back to top</a>)</p>

### Page.FormActions
- Avails facility to show `FormActions`, to be used inside `FormWrapper` along with `Form`. Required to provide `formRef`.
```jsx
    const formRef = React.createRef();
    
    // return
    <Page
        explicitForm={true}
    >
        <Page.FormWrapper>
            {({ formState, onClose, open }) => (
                <>
                    <Page.Form ref={formRef} />
                    <Page.FormActions formRef={formRef} />
                </>
            )}
        </Page.FormWrapper>
    </Page>
``` 
<p align="right">(<a href="#top">back to top</a>)</p>

### Page.Form
- Avails facility to show `Form`, to be used inside `FormWrapper` along with `FormActions`. Required to provide `formRef`.
```jsx
    const formRef = React.createRef();
    
    // return
    <Page
        explicitForm={true}
    >
        <Page.FormWrapper>
            {({ formState, onClose, open }) => (
                <>
                    <Page.Form formRef={formRef} />
                    <Page.FormActions formRef={formRef} />
                </>
            )}
        </Page.FormWrapper>
    </Page>
```
<p align="right">(<a href="#top">back to top</a>)</p>