import { useState } from 'react';
import { Widget, Provider, Page } from '@knovator/pagecreator-admin';

const formatOptionLabel = (code: string, data: any) => {
  if (code === 'category' || code === 'product') {
    return <div>{data.name}</div>;
  }
  return (
    <div>
      {data?.value}-{data?.label}
    </div>
  );
};
const formatListItems = (code: string, data: any) => {
  if (code === 'category' || code === 'product') {
    return <div>{data.name}</div>;
  }
  return (
    <div>
      {data?.value}-{data?.label}
    </div>
  );
};

export const App = () => {
  const [selectedType, setSelectedType] = useState('widget');

  return (
    <>
      <div className="form-group">
        <label htmlFor="widget">
          <input
            type="radio"
            value="widget"
            id="widget"
            checked={selectedType === 'widget'}
            onChange={(e) => setSelectedType(e.target.value)}
          />
          Widget
        </label>
        <label htmlFor="page">
          <input
            type="radio"
            value="page"
            id="page"
            checked={selectedType === 'page'}
            onChange={(e) => setSelectedType(e.target.value)}
          />
          Page
        </label>
      </div>
      <Provider baseUrl={process.env['NX_API_URL']} token="ABCD">
        {selectedType === 'widget' && (
          <Widget
            formatOptionLabel={formatOptionLabel}
            formatListItem={formatListItems}
          />
        )}
        {selectedType === 'page' && <Page />}
      </Provider>
    </>
  );
};

export default App;
