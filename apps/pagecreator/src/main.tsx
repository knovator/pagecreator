import * as ReactDOM from 'react-dom/client';

import App from './app/app';

const rootElement = document.getElementById('root') as HTMLElement | null;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App /> as unknown as Parameters<typeof root.render>[0]);
}
