export type ObjectType = {
  [key: string]: string | boolean | number | null | undefined | ObjectType;
};
