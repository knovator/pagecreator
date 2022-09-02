import { CollectionItemProps } from '../../../types';

export function CollectionItem({ name }: CollectionItemProps) {
  return (
    <div className="kpc_item">
      <p className="kpc_item-text">{name}</p>
    </div>
  );
}

export default CollectionItem;
