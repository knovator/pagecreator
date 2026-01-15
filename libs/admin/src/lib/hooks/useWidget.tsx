import { useCallback, useEffect, useState } from 'react';
import { CALLBACK_CODES, INTERNAL_ERROR_CODE } from '../constants/common';
import { useProviderState } from '../context/ProviderContext';
import { paginationDataGatter, dataGatter, build_path } from '../helper/utils';
import usePagination from './usePagination';
import request, { getApiType } from '../api';
import { Routes_Input, WidgetType, ItemsType } from '../types';
import { FormActionTypes, ObjectType, LanguageType } from '../types/common';

interface UseWidgetProps {
  canList?: boolean;
  defaultLimit: number;
  routes?: Routes_Input;
  preConfirmDelete?: (data: { row: ObjectType }) => Promise<boolean>;
  imageBaseUrl?: string;
}

const useWidget = ({
  canList = true,
  defaultLimit,
  routes,
  preConfirmDelete,
  imageBaseUrl,
}: UseWidgetProps) => {
  const [list, setList] = useState<ObjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [languages, setLanguages] = useState<LanguageType[]>([]);
  const [itemData, setItemData] = useState<ObjectType | null>(null);
  const [formState, setFormState] = useState<FormActionTypes>();
  const [itemsTypes, setItemsTypes] = useState<ItemsType[]>([]);
  const [widgetTypes, setWidgetTypes] = useState<WidgetType[]>([]);
  const [collectionDataLoading, setCollectionDataLoading] =
    useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);

  const { baseUrl, token, onError, onSuccess, onLogout, widgetRoutesPrefix } =
    useProviderState();
  const {
    changeSearch,
    setPageSize,
    pageSize,
    limitRef,
    currentPageRef,
    setCurrentPage,
    offsetRef,
    searchRef,
  } = usePagination({ defaultLimit });

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
              offset: offsetRef.current,
              limit: limitRef.current,
              page: currentPageRef.current,
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
      currentPageRef,
      limitRef,
      offsetRef,
      handleError,
      routes,
      token,
      widgetRoutesPrefix,
    ]
  );
  const getLanguagesList = useCallback(async () => {
    const api = getApiType({
      routes,
      action: 'LANGUAGES',
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
      setLanguages(response.data);
      return response.data;
    }
  }, [baseUrl, handleError, widgetRoutesPrefix, routes, token]);

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
        if (response.message)
          onSuccess(
            CALLBACK_CODES.PARTIAL_UPDATE,
            response?.code,
            response?.message
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
    if (itemsTypes?.length > 0) return;
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
      return setItemsTypes(dataGatter(response));
    }
    setLoading(false);
  };
  const getWidgetTypes = async () => {
    if (widgetTypes?.length > 0) return;
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
      return setWidgetTypes(dataGatter(response));
    }
    setLoading(false);
  };
  const getCollectionData = async (
    collectionName: string,
    search?: string,
    callback?: (data: any) => void,
    collectionItems?: string[]
  ) => {
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
        collectionItems: collectionItems || [],
      },
    });
    if (response?.code === 'SUCCESS') {
      setCollectionDataLoading(false);
      if (typeof callback === 'function')
        callback(paginationDataGatter(response));
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
        if (formState === 'ADD') {
          setCurrentPage(1);
        }
        setLoading(false);
        onSuccess(code, response?.code, response?.message);
        getWidgets();
        onCloseForm();
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const onCloseForm = () => {
    setFormState(undefined);
    setItemData(null);
  };
  const getAndSetWidget = async (id: string) => {
    try {
      setLoading(true);
      const api = getApiType({
        routes,
        action: 'GET_ONE',
        prefix: widgetRoutesPrefix,
        id,
      });
      const response = await request({
        baseUrl,
        token,
        url: api.url,
        method: api.method,
        onError: handleError(CALLBACK_CODES.GET_SINGLE),
      });
      if (response?.code === 'SUCCESS') {
        setLoading(false);
        const data = response?.data;
        if (Array.isArray(data.items)) {
          const items = JSON.parse(JSON.stringify(data.items));
          data.webItems = items.filter((item: any) => item.itemType === 'Web');
          data.mobileItems = items.filter(
            (item: any) => item.itemType === 'Mobile'
          );
          delete data.items;
        }
        setItemData(data);
      }
    } catch (error) {
      setLoading(false);
      onError(CALLBACK_CODES.UPDATE, '', (error as Error).message);
    }
  };
  const onChangeFormState = async (
    state: FormActionTypes,
    data?: ObjectType
  ) => {
    setFormState(state);
    // fetch ItemsTypes & WidgetTypes if needed
    if (state === 'ADD' || state === 'UPDATE') {
      getWidgetsTypes();
      getWidgetTypes();
    }
    // get Item data if widget is updating
    if (state === 'UPDATE' && data) {
      getAndSetWidget(data['_id']);
    } else if (state === 'ADD') {
      // reset Item data if widget is adding
      setItemData(null);
    } else if (state === 'DELETE' && data) {
      setItemData(data);
      setFormState(state);
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
          fileUrl: build_path(
            imageBaseUrl ? imageBaseUrl : baseUrl,
            responseData?.uri
          ),
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
  const changeCurrentPage = (page: number) => {
    setCurrentPage(page);
    getWidgets(searchRef.current);
  };

  useEffect(() => {
    if (canList) getWidgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canList]);

  useEffect(() => {
    getLanguagesList();
  }, [getLanguagesList]);

  return {
    list,
    getWidgets,
    loading,
    languages,
    setLoading,

    // Pagination
    searchText: searchRef.current,
    pageSize,
    totalPages,
    currentPage: currentPageRef.current,
    totalRecords,
    setCurrentPage: changeCurrentPage,
    setPageSize,

    // Form
    formState,
    itemData,
    onChangeFormState,
    onCloseForm,
    onWidgetFormSubmit,
    onCofirmDeleteWidget,
    onPartialUpdateWidget,
    onImageUpload,
    onImageRemove,
    itemsTypes,
    widgetTypes,
    changeSearch,
    collectionDataLoading,
    getCollectionData,
    collectionData,
  };
};

export default useWidget;
