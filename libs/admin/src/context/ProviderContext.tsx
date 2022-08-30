/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';

const ProviderContext = createContext<ProviderContextType | null>(null);

const Provider = ({
  children,
  baseUrl,
  token,
  onError = () => {},
  onSuccess = () => {},
  onLogout = () => {},
  tilesRoutesPrefix = 'tiles',
  widgetRoutesPrefix = 'widgets',
  pageRoutesPrefix = 'pages',
}: ProviderContextProviderProps) => {
  return (
    <ProviderContext.Provider
      value={{
        baseUrl,
        token,
        onError,
        onSuccess,
        onLogout,
        tilesRoutesPrefix,
        widgetRoutesPrefix,
        pageRoutesPrefix,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

export function useProviderState() {
  const context = useContext(ProviderContext);
  if (!context)
    throw new Error(
      'Provider Context must be used within ProviderContext.Provider'
    );

  return context;
}

export default Provider;
