const DEFAULT_OFFSET_PAYLOAD = 0;
const DECIMAL_REDIX = 10;
const DEFAULT_CURRENT_PAGE = 1;
const INTERNAL_ERROR_CODE = 'INTERNAL_ERROR';
const DEFAULT_LIMIT = 10;
const PAGE_LIMITS = [10, 20, 30];

enum CALLBACK_CODES {
  'GET_ALL' = 'GET_ALL',
  'GET_SINGLE' = 'GET_SINGLE',
  'CREATE' = 'CREATE',
  'UPDATE' = 'UPDATE',
  'PARTIAL_UPDATE' = 'PARTIAL_UPDATE',
  'DELETE' = 'DELETE',
  'IMAGE_UPLOAD' = 'IMAGE_UPLOAD',
  'IMAGE_REMOVE' = 'IMAGE_REMOVE',
  'INTERNAL' = 'INTERNAL',
}

const CONSTANTS = {
  EMPTY_REGEX: / /g,
  SLUG_REGEX: /^[\da-z-]*$/,
  SLUG_REPLACE_REGEX: /[^\da-z-]/gi,
};

const DEFAULT_PERMISSIONS = {
  list: true,
  add: true,
  delete: true,
  partialUpdate: true,
  update: true,
};

const TRANSLATION_PAIRS_COMMON = {
  confirmationRequired: 'Confirmation Required',
  permanentlyDelete: 'You are about to permanently delete the',
  lossOfData:
    'This action can lead to data loss. To prevent accidental actions we ask you to confirm your intention.',
  pleaseType: 'Please type',
  toProceedOrCancel: 'to processed or close this modal to cancel.',
  confirm: 'Confirm',
  next: 'Next',
  previous: 'Previous',
  page: 'Page',
  indicatesRequired: 'Indicates fields are required',
  cancel: 'Cancel',
  yes: 'Yes',
  delete: 'Delete',
  create: 'Create',
  update: 'Update',
  showing: 'Showing',
  add: 'Add',
  of: 'of',
  typeHerePlaceholder: 'Type Here',

  code: 'Code',
  codePlaceholder: 'Enter code',
  codeRequired: 'Code is required',
  name: 'Name',
  namePlaceholder: 'Enter name',
  nameRequired: 'Name is required',
  title: 'Title',
  titlePlaceholder: 'Enter title',
  titleRequired: 'Title is required',

  active: 'Active',
  actions: 'Actions',
};

const TRANSLATION_PAIRS_WIDGET = {
  itemsType: 'Items Type',
  itemsTypePlaceholder: 'Select Items Type',
  widgetType: 'Widget Type',
  widgetTypeRequired: 'Widget Type is required',
  color: 'Color',
  webPerRow: 'Web Per Row',
  webPerRowPlaceholder: 'Enter web per row',
  mobilePerRow: 'Mobile Per Row',
  mobilePerRowPlaceholder: 'Enter mobile per row',
  tabletPerRow: 'Tablet Per Row',
  tabletPerRowPlaceholder: 'Enter tablet per row',
  mobileItems: 'Mobile Items',
  webItems: 'Web Items',
  searchPlaceholder: 'Search Widgets...',
  autoPlay: 'Auto Play',
  addWidgetTitle: 'Add Widget',
  updateWidgetTitle: 'Update Widget',
  webPerRowRequired: 'Web Per Row is required',
  tabletPerRowRequired: 'Tablet Per Row is required',
  mobilePerRowRequired: 'Mobile Per Row is required',
  tabDeleteTitle: 'Are you sure you want to delete this tab?',
  widgetTitleInfo: 'HTML is supported',
  minPerRow: 'Value must be greater than zero',
  // actionsLabel': 'Actions', -> 'actions'
  tabNameRequired: 'Tab Name is required',

  subtitle: 'Subtitle',
  subTitlePlaceholder: 'Enter Subtitle',
  altText: 'Alt Text',
  altTextPlaceholder: 'Enter alt text',
  link: 'Link',
  linkPlaceholder: 'Enter link',
  image: 'Image',
  uploadFile: 'Upload File',
  dragDrop: 'or drag and drop',
  allowedFormat: 'PNG, JPG, SVG up to 2 MB',
  srcset: 'Srcset',
  screenSizeRequired: 'ScreenSize is required',
  widthRequired: 'Width is required',
  heightRequired: 'Height is required',
  minScreenSize: 'ScreenSize should be greater than 0',
  minWidth: 'Width should be greater than 0',
  minHeight: 'Height should be greater than 0',
  deleteTitle: 'Are you sure you want to delete this item?',
  htmlContent: 'HTML',
  htmlContentPlaceholder: 'Enter your html',
  htmlContentRequired: 'html is required',
  textContent: 'Text',
  textContentRequired: 'Text is required',
  textContentInfo: 'HTML is supported',
  textContentPlaceholder: 'Enter text',
};
const TRANSLATION_PAIRS_PAGE = {
  widgets: 'Widgets',
  slug: 'Slug',
  slugPlaceholder: 'Enter Slug',
  slugRequired: 'Slug is required',
  addPage: 'Add Page',
  updatePage: 'Update Page',
  searchPages: 'Search Pages...',
};
export {
  CONSTANTS,
  CALLBACK_CODES,
  DECIMAL_REDIX,
  DEFAULT_CURRENT_PAGE,
  DEFAULT_OFFSET_PAYLOAD,
  INTERNAL_ERROR_CODE,
  DEFAULT_PERMISSIONS,
  TRANSLATION_PAIRS_COMMON,
  DEFAULT_LIMIT,
  PAGE_LIMITS,
  TRANSLATION_PAIRS_WIDGET,
  TRANSLATION_PAIRS_PAGE,
};
