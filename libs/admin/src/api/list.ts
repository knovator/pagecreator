const apiList = {
  LIST: ({ prefix }: API_INPUT_TYPE) => ({
    url: `${prefix}/list`,
    method: 'POST',
  }),
  CREATE: ({ prefix }: API_INPUT_TYPE) => ({
    url: `${prefix}`,
    method: 'POST',
  }),
  UPDATE: ({ prefix, id }: API_INPUT_TYPE) => ({
    url: `${prefix}/${id}`,
    method: 'PUT',
  }),
  PARTIAL_UPDATE: ({ prefix, id }: API_INPUT_TYPE) => ({
    url: `${prefix}/${id}`,
    method: 'PATCH',
  }),
  DELETE: ({ prefix, id }: API_INPUT_TYPE) => ({
    url: `${prefix}/${id}`,
    method: 'DELETE',
  }),
  WIDGET_TYPES: ({ prefix }: API_INPUT_TYPE) => ({
    url: `${prefix}/widget-types`,
    method: 'GET',
  }),
  SELECTION_TYPES: ({ prefix }: API_INPUT_TYPE) => ({
    url: `${prefix}/selection-types`,
    method: 'GET',
  }),
  TILES: ({ prefix, id }: API_INPUT_TYPE) => ({
    url: `${prefix}/${id}`,
    method: 'GET',
  }),
  COLLECTION_DATA: ({ prefix }: API_INPUT_TYPE) => ({
    url: `${prefix}/collection-data`,
    method: 'POST',
  }),

  // Image Upload API
  IMAGE_UPLOAD: ({ prefix }: API_INPUT_TYPE) => ({
    url: `${prefix}/upload`,
    method: 'post',
  }),
  IMAGE_REMOVE: ({ prefix, id }: API_INPUT_TYPE) => ({
    url: `${prefix}/${id}/delete`,
    method: 'DELETE',
  }),
};

export default apiList;
