import {
  Model,
  FilterQuery,
  QueryOptions,
  ProjectionType,
  HydratedDocument,
  QueryWithHelpers,
} from 'mongoose';
import { EntityType, IModel, ReturnDocument } from '../types';

// create
export async function create<T extends EntityType>(
  Modal: Model<T>,
  data: Partial<T>
): Promise<ReturnDocument> {
  const modalInstance = new Modal(data);
  return await modalInstance.save();
}
// update
export async function update<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType>,
  data: Partial<T>
): Promise<T | undefined> {
  await getOne(Modal, query);
  const result = await Modal.findOneAndUpdate(query, data, { new: true });
  return result || undefined;
}
// soft-delete
export async function remove<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType>
): Promise<T | undefined> {
  const modalInstance = await getOne(Modal, query);
  await modalInstance.remove();
  return modalInstance;
}
// delete-all
export async function deleteAll<T extends EntityType>(Modal: Model<T>, query: FilterQuery<T>) {
  return Modal.deleteMany(query);
}
// get-all
export function getAll<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType> = {},
  options?: QueryOptions<EntityType>,
  projection?: ProjectionType<EntityType>
  // eslint-disable-next-line @typescript-eslint/ban-types
): QueryWithHelpers<Array<T>, T, {}, T> {
  return Modal.find(query, projection, options);
}
// list
export async function list<T extends EntityType>(
  Modal: IModel<T>,
  where: FilterQuery<T>,
  options: QueryOptions<T>
): Promise<ReturnDocument[]> {
  try {
    const documents = Modal.paginate(where, options);
    return documents;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
// get-one
export async function getOne<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType>,
  projection?: ProjectionType<EntityType>
): Promise<HydratedDocument<T>> {
  const modalInstance: HydratedDocument<T> | null = await Modal.findOne(
    query,
    projection
  );
  if (!modalInstance)
    throw new Error(`Record not found ${Modal.name ? `in ${Modal.name}` : ''}`);

  return modalInstance;
}
// bulk-insert
export async function bulkInsert<T extends EntityType>(Modal: Model<T>, docs: T[]): Promise<ReturnDocument[]> {
  return await Modal.insertMany(docs);
}

export async function checkUnique<T extends EntityType>({
Modal,
uniqueField,
errorMessage,
value
}: {
  Modal: Model<T>,
  uniqueField: keyof T,
  value: any,
  errorMessage: string
}): Promise<void> {
  const query: FilterQuery<T> = { [uniqueField]: value } as FilterQuery<T>;
  let result;
  try {
    result = await getOne(Modal, query);
  } catch (error) {}
  if(result) throw new Error(errorMessage)
}