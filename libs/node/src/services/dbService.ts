import {
  Model,
  FilterQuery,
  QueryOptions,
  ProjectionType,
  HydratedDocument,
  QueryWithHelpers,
} from 'mongoose';
import { EntityType, IModel } from '../types';

// create
export async function create<T>(
  Modal: Model<T>,
  data: Partial<T>
): Promise<HydratedDocument<T>> {
  const modalInstance = new Modal(data);
  return (await modalInstance.save()) as unknown as HydratedDocument<T>;
}
// update
export async function update<T>(
  Modal: Model<T>,
  query: FilterQuery<T>,
  data: Partial<T>
): Promise<HydratedDocument<T> | undefined> {
  await getOne(Modal, query);
  const result = (await Modal.findOneAndUpdate(query, data, {
    new: true,
  })) as HydratedDocument<T> | null;
  return result || undefined;
}
// soft-delete
export async function remove<T>(
  Modal: Model<T>,
  query: FilterQuery<T>
): Promise<HydratedDocument<T>> {
  const modalInstance = await getOne(Modal, query);
  return (await modalInstance.remove()) as unknown as HydratedDocument<T>;
}
// delete-all
export async function deleteAll<T>(Modal: Model<T>, query: FilterQuery<T>) {
  return Modal.deleteMany(query);
}
// get-all
export function getAll<T>(
  Modal: Model<T>,
  query: FilterQuery<T> = {},
  options?: QueryOptions<T>,
  projection?: ProjectionType<T>
  // eslint-disable-next-line @typescript-eslint/ban-types
): QueryWithHelpers<Array<HydratedDocument<T>>, HydratedDocument<T>, {}, T> {
  return Modal.find(query, projection, options);
}
// list
export async function list<T>(
  Modal: IModel<T>,
  where: FilterQuery<T>,
  options: QueryOptions<T>
): Promise<any> {
  try {
    const documents = Modal.paginate(where, options);
    return documents;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
// get-one
export async function getOne<T>(
  Modal: Model<T>,
  query: FilterQuery<T>,
  projection?: ProjectionType<T>
): Promise<HydratedDocument<T>> {
  const modalInstance = (await Modal.findOne(query, projection)) as
    | HydratedDocument<T>
    | null;
  if (!modalInstance)
    throw new Error(`Record not found ${Modal.name ? `in ${Modal.name}` : ''}`);

  return modalInstance;
}
// bulk-insert
export async function bulkInsert<T>(
  Modal: Model<T>,
  docs: T[]
): Promise<Array<HydratedDocument<T>>> {
  return (await Modal.insertMany(docs)) as Array<HydratedDocument<T>>;
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
