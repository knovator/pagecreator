import { useCallback, useEffect, useState } from 'react';
import { CALLBACK_CODES, INTERNAL_ERROR_CODE } from '../constants/common';
import { useProviderState } from '../context/ProviderContext';
import { paginationDataGatter, dataGatter, build_path } from '../helper/utils';
import usePagination from './usePagination';
import request, { getApiType } from '../api';
import { Routes_Input, SelectionType, WidgetType } from '../types';
import { FormActionTypes, ObjectType } from '../types/common';

interface UseWidgetProps {
  defaultLimit: number;
  routes?: Routes_Input;
  preConfirmDelete?: (data: { row: ObjectType }) => Promise<boolean>;
}
interface TilesList {
  web: ObjectType[];
  mobile: ObjectType[];
}

const useWidget = ({
  defaultLimit,
  routes,
  preConfirmDelete,
}: UseWidgetProps) => {
  const [list, setList] = useState<ObjectType[]>([]);
  const [tilesList, setTilesList] = useState<TilesList>({
    web: [],
    mobile: [],
  });
  const [tilesLoading, setTilesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemData, setItemData] = useState<ObjectType | null>(null);
  const [formState, setFormState] = useState<FormActionTypes>();
  const [widgetTypes, setWidgetTypes] = useState<WidgetType[]>([]);
  const [selectionTypes, setSelectionTypes] = useState<SelectionType[]>([]);
  const [collectionDataLoading, setCollectionDataLoading] =
    useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);

  const {
    baseUrl,
    token,
    onError,
    onSuccess,
    onLogout,
    widgetRoutesPrefix,
    tilesRoutesPrefix,
  } = useProviderState();
  const { setPageSize, pageSize, currentPage, setCurrentPage, filter } =
    usePagination({ defaultLimit });

  const handleError = useCallback(
    (code: CALLBACK_CODES) => (error: any) => {
      const { data = {} } = error?.response || {};
      if (data?.code === 'UNAUTHENTICATED') {
        onLogout();
      }
      onError(code, 'error', data?.message);
    },
    [onError, onLogout]
  );
  // List operations
  const getWidgets = useCallback(
    async (search?: string) => {
      try {
        setLoading(true);
        const api = getApiType({
          routes,
          action: 'LIST',
          prefix: widgetRoutesPrefix,
        });
        const response = await request({
          baseUrl,
          token,
          method: api.method,
          url: api.url,
          onError: handleError(CALLBACK_CODES.GET_ALL),
          data: {
            search,
            options: {
              offset: filter.offset,
              limit: filter.limit,
              page: currentPage,
            },
          },
        });
        if (response?.code === 'SUCCESS') {
          setLoading(false);
          setTotalPages(response.data.totalPages);
          setTotalRecords(response.data.totalDocs);
          return setList(paginationDataGatter(response));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [
      baseUrl,
      currentPage,
      filter.limit,
      filter.offset,
      handleError,
      routes,
      token,
      widgetRoutesPrefix,
    ]
  );
  const getTiles = useCallback(
    async (id: string) => {
      try {
        setTilesLoading(true);
        const api = getApiType({
          routes,
          action: 'TILES',
          prefix: tilesRoutesPrefix,
          id,
        });
        const response = await request({
          baseUrl,
          token,
          method: api.method,
          url: api.url,
          onError: handleError(CALLBACK_CODES.GET_ALL),
        });
        if (response?.code === 'SUCCESS') {
          setTilesLoading(false);
          const tilesResponse: TilesList = dataGatter(response).reduce(
            (acc: TilesList, tileItem: ObjectType) => {
              if (tileItem['tileType'] === 'Web') acc.web.push(tileItem);
              else acc.mobile.push(tileItem);
              return acc;
            },
            { web: [], mobile: [] }
          );
          return setTilesList(tilesResponse);
        }
        setTilesLoading(false);
      } catch (error) {
        setTilesLoading(false);
      }
    },
    [baseUrl, handleError, routes, tilesRoutesPrefix, token]
  );
  const onDeleteTile = async (id: string) => {
    try {
      setTilesLoading(true);
      const api = getApiType({
        routes,
        action: 'DELETE',
        prefix: tilesRoutesPrefix,
        id,
      });
      const response = await request({
        baseUrl,
        token,
        method: api.method,
        url: api.url,
        onError: handleError(CALLBACK_CODES.DELETE),
      });
      if (response?.code === 'SUCCESS') {
        setTilesLoading(false);
        onSuccess(CALLBACK_CODES.DELETE, response?.code, response?.message);
        if (itemData) getTiles(itemData['_id']);
        return;
      }
      setTilesLoading(false);
      onError(CALLBACK_CODES.DELETE, response?.code, response?.message);
    } catch (error) {
      setTilesLoading(false);
      onError(
        CALLBACK_CODES.DELETE,
        INTERNAL_ERROR_CODE,
        (error as Error).message
      );
    }
  };
  const onCofirmDeleteWidget = async () => {
    try {
      let proceed = true;
      if (typeof preConfirmDelete === 'function' && itemData) {
        try {
          proceed = await preConfirmDelete({ row: itemData });
        } catch (error) {
          proceed = false;
        }
      }

      if (proceed) {
        setLoading(true);
        const api = getApiType({
          routes,
          action: 'DELETE',
          prefix: widgetRoutesPrefix,
          id: itemData?.['_id'],
        });
        const response = await request({
          baseUrl,
          token,
          method: api.method,
          url: api.url,
          onError: handleError(CALLBACK_CODES.DELETE),
        });
        if (response?.code === 'SUCCESS') {
          setLoading(false);
          onSuccess(CALLBACK_CODES.DELETE, response?.code, response?.message);
          getWidgets();
          onCloseForm();
          return;
        }
        setLoading(false);
        onError(CALLBACK_CODES.DELETE, response?.code, response?.message);
        onCloseForm();
      }
    } catch (error) {
      setLoading(false);
      onError(
        CALLBACK_CODES.DELETE,
        INTERNAL_ERROR_CODE,
        (error as Error).message
      );
      onCloseForm();
    }
  };
  const onPartialUpdateWidget = async (data: ObjectType, id: string) => {
    try {
      const api = getApiType({
        routes,
        action: 'PARTIAL_UPDATE',
        prefix: widgetRoutesPrefix,
        id,
      });
      const response = await request({
        baseUrl,
        token,
        data,
        url: api.url,
        method: api.method,
        onError: handleError(CALLBACK_CODES.PARTIAL_UPDATE),
      });
      if (response?.code === 'SUCCESS') {
        setList((oldListData) =>
          oldListData.map((item) => (item['_id'] === id ? response.data : item))
        );
      } else {
        onError(
          CALLBACK_CODES.PARTIAL_UPDATE,
          response?.code,
          response?.message
        );
      }
    } catch (error) {
      onError(
        CALLBACK_CODES.PARTIAL_UPDATE,
        INTERNAL_ERROR_CODE,
        (error as Error).message
      );
    }
  };
  const getWidgetsTypes = async () => {
    if (widgetTypes?.length > 0) return;
    setLoading(true);
    const api = getApiType({
      routes,
      action: 'WIDGET_TYPES',
      prefix: widgetRoutesPrefix,
    });
    const response = await request({
      baseUrl,
      token,
      method: api.method,
      url: api.url,
      onError: handleError(CALLBACK_CODES.GET_ALL),
    });
    if (response?.code === 'SUCCESS') {
      setLoading(false);
      return setWidgetTypes(dataGatter(response));
    }
    setLoading(false);
  };
  const getSelectionTypes = async () => {
    if (selectionTypes?.length > 0) return;
    setLoading(true);
    const api = getApiType({
      routes,
      action: 'SELECTION_TYPES',
      prefix: widgetRoutesPrefix,
    });
    const response = await request({
      baseUrl,
      token,
      method: api.method,
      url: api.url,
      onError: handleError(CALLBACK_CODES.GET_ALL),
    });
    if (response?.code === 'SUCCESS') {
      setLoading(false);
      return setSelectionTypes(dataGatter(response));
    }
    setLoading(false);
  };
  const getCollectionData = async (collectionName: string, search?: string) => {
    setCollectionDataLoading(true);
    const api = getApiType({
      routes,
      action: 'COLLECTION_DATA',
      prefix: widgetRoutesPrefix,
      id: collectionName,
    });
    const response = await request({
      baseUrl,
      token,
      method: api.method,
      url: api.url,
      onError: handleError(CALLBACK_CODES.GET_ALL),
      data: {
        search: search || '',
        collectionName,
      },
    });
    if (response?.code === 'SUCCESS') {
      setCollectionDataLoading(false);
      return setCollectionData(paginationDataGatter(response));
    }
    setCollectionDataLoading(false);
  };
  // Form operations
  const onWidgetFormSubmit = async (data: ObjectType) => {
    try {
      setLoading(true);
      const code =
        formState === 'ADD' ? CALLBACK_CODES.CREATE : CALLBACK_CODES.UPDATE;
      const api = getApiType({
        routes,
        action: formState === 'ADD' ? 'CREATE' : 'UPDATE',
        prefix: widgetRoutesPrefix,
        id: itemData?.['_id'],
      });
      const response = await request({
        baseUrl,
        token,
        data,
        url: api.url,
        method: api.method,
        onError: handleError(code),
      });
      if (response?.code === 'SUCCESS') {
        setLoading(false);
        onSuccess(code, response?.code, response?.message);
        getWidgets();
        onCloseForm();
      }
    } catch (error) {
      setLoading(false);
      onError(
        CALLBACK_CODES.UPDATE,
        INTERNAL_ERROR_CODE,
        (error as Error).message
      );
    }
  };
  const onCloseForm = () => {
    setFormState(undefined);
    setItemData(null);
  };
  const onChangeFormState = (state: FormActionTypes, data?: ObjectType) => {
    setItemData(data || null);
    setFormState(state);
    // fetch WidgetTypes & SelectionTypes if needed
    if (state === 'ADD' || state === 'UPDATE') {
      getWidgetsTypes();
      getSelectionTypes();
    }
    // get Tile data if widget is updating
    if (state === 'UPDATE' && data) {
      if (data['widgetType'] !== 'Image' && data['collectionName'])
        getCollectionData(data['collectionName']);
      else getTiles(data['_id']);
    } else if (state === 'ADD') {
      // reset Tile data if widget is adding
      setTilesList({ web: [], mobile: [] });
    }
  };
  const onTileFormSubmit = async (
    state: FormActionTypes,
    data: ObjectType,
    updateId?: string
  ) => {
    setTilesLoading(true);
    const code =
      state === 'ADD' ? CALLBACK_CODES.CREATE : CALLBACK_CODES.UPDATE;
    try {
      const api = getApiType({
        routes,
        action: state === 'ADD' ? 'CREATE' : 'UPDATE',
        prefix: tilesRoutesPrefix,
        id: updateId,
      });
      const response = await request({
        baseUrl,
        token,
        data,
        url: api.url,
        method: api.method,
        onError: handleError(code),
      });
      if (response?.code === 'SUCCESS') {
        setTilesLoading(false);
        onSuccess(code, response?.code, response?.message);
        if (itemData) getTiles(itemData['_id']);
      } else {
        setTilesLoading(false);
        onError(code, response?.code, response?.message);
      }
    } catch (error) {
      setTilesLoading(false);
      onError(code, INTERNAL_ERROR_CODE, (error as Error).message);
    }
  };
  // Image Upload operations
  const onImageUpload = async (
    file: File
  ): Promise<{ fileUrl: string; fileId: string; fileUri: string } | void> => {
    try {
      const payload = new FormData();
      payload?.append('folder', 'images');
      payload?.append('file', file, file.name);
      const api = getApiType({
        routes,
        action: 'IMAGE_UPLOAD',
        prefix: 'media',
      });
      const response = await request({
        data: payload,
        baseUrl,
        token,
        method: api.method,
        url: api.url,
        config: {
          contentType: 'multipart/form-data',
        },
        onError: handleError(CALLBACK_CODES.IMAGE_UPLOAD),
      });
      if (response.code === 'SUCCESS') {
        const responseData = response?.data[0] || response?.data;
        return {
          fileId: responseData?._id || responseData?.id,
          fileUrl: build_path(baseUrl, responseData?.uri),
          fileUri: responseData?.uri,
        };
      } else
        onError(CALLBACK_CODES.IMAGE_REMOVE, response.code, response.message);
    } catch (error) {
      onError(
        CALLBACK_CODES.IMAGE_REMOVE,
        INTERNAL_ERROR_CODE,
        (error as Error).message
      );
    }
  };
  const onImageRemove = async (id: string): Promise<void> => {
    try {
      const api = getApiType({
        routes,
        action: 'IMAGE_REMOVE',
        prefix: 'media',
        id,
      });
      const response = await request({
        baseUrl,
        token,
        method: api.method,
        url: api.url,
        onError: handleError(CALLBACK_CODES.IMAGE_REMOVE),
      });
      if (response?.code === 'SUCCESS') {
        onSuccess(CALLBACK_CODES.IMAGE_REMOVE, response.code, response.message);
      } else {
        onError(CALLBACK_CODES.IMAGE_REMOVE, response.code, response.message);
      }
    } catch (error) {
      onError(
        CALLBACK_CODES.IMAGE_REMOVE,
        INTERNAL_ERROR_CODE,
        (error as Error).message
      );
    }
  };

  useEffect(() => {
    getWidgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage]);

  return {
    list,
    getWidgets,
    loading,
    setLoading,

    // Pagination
    pageSize,
    totalPages,
    currentPage,
    totalRecords,
    setCurrentPage,
    setPageSize,

    // Form
    formState,
    itemData,
    onChangeFormState,
    onCloseForm,
    onDeleteTile,
    onWidgetFormSubmit,
    onCofirmDeleteWidget,
    onPartialUpdateWidget,
    onImageUpload,
    onImageRemove,
    widgetTypes,
    selectionTypes,
    collectionDataLoading,
    getCollectionData,
    collectionData,

    // Tiles
    tilesList,
    tilesLoading,
    onTileFormSubmit,
  };
};

export default useWidget;
