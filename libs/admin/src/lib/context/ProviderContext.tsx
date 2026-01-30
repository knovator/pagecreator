/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { TRANSLATION_PAIRS_COMMON } from '../constants/common';
import { ProviderContextProviderProps, ProviderContextType } from '../types';

const ProviderContext = createContext<ProviderContextType | null>(null);

const Provider = ({
  children,
  baseUrl,
  token,
  translations,
  onError = () => {},
  onSuccess = () => {},
  onLogout = () => {},
  switchClass = 'khb_switch',
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
        switchClass,
        widgetRoutesPrefix,
        pageRoutesPrefix,
        commonTranslations: {
          ...TRANSLATION_PAIRS_COMMON,
          ...(translations || {}),
        },
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
