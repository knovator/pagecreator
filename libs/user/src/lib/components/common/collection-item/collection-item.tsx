import React from 'react';
import { CollectionItemProps } from '../../../types';

export function CollectionItem({ name, onClick }: CollectionItemProps) {
  return (
    <div className="kpc_item" onClick={() => onClick && onClick()}>
      <p className="kpc_item-text">{name || 'Laurem Ipsum'}</p>
    </div>
  );
}

export default CollectionItem;
