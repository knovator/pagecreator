import { useState } from 'react';
import { Widget, Provider, Page } from '@knovator/pagecreator-admin';

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
            formatOptionLabel={(code: any, label: any) => (
              <div>
                {label?.name}-{label?._id}
              </div>
            )}
            formatListItem={(code: any, label: any) => (
              <div>
                {label?.name}-{label?._id}
              </div>
            )}
          />
        )}
        {selectedType === 'page' && <Page />}
      </Provider>
    </>
  );
};

export default App;
