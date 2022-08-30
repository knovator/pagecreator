export type ACTION_TYPES =
  | 'IMAGE_UPLOAD'
  | 'IMAGE_REMOVE'
  | 'CREATE'
  | 'LIST'
  | 'DELETE'
  | 'UPDATE'
  | 'TILES'
  | 'PARTIAL_UPDATE'
  | 'WIDGET_TYPES'
  | 'SELECTION_TYPES'
  | 'COLLECTION_DATA';

export type API_TYPE = {
  url: string;
  method: string;
};

export type API_INPUT_TYPE = { prefix: string; id?: string };

export type Routes_Input = {
  [K in ACTION_TYPES]?: (data: API_INPUT_TYPE) => API_TYPE;
};

export type WidgetType = { value: string; label: string };
export type SelectionType = { value: string; label: string };

export interface BaseAPIProps {
  config?: any;
  baseUrl: string;
  token: string | (() => Promise<string>);
  data?: any;
  url: string;
  method: string;
  onError?: (error: Error) => void;
}
