export const VALIDATION = {
  WIDGET_EXISTS: 'Widget with same code is available!',
  SLUG_EXISTS: 'Widget with same slug is available!',
};
export const RESPONSE_CODES = {
	DEFAULT: 'SUCCESS',
	ERROR: 'ERROR',
	VALIDATION_FAILED: 'VALIDATION_FAILED'
};
export const REGEXS = {
	OBJECTID_CAST_FAILED: /Cast to ObjectId failed/gm,
	IS_AVAILABLE: /is available!/gm
};
export const MONGOOSE_FIND_QUERIES = [
	'count',
	'find',
	'findOne',
	'findOneAndDelete',
	'findOneAndRemove',
	'findOneAndUpdate',
	'update',
	'updateOne',
	'updateMany',
];
export const success = 200;
export const create = 201;
export const internalServerError = 500;
export const validationError = 422;
export const notFoundError = 404;
export const messageRoutePrefix = 'msg';
