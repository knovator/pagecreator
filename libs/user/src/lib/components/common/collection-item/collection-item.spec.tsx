import { render } from '@testing-library/react';

import CollectionItem from './collection-item';

describe('CollectionItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CollectionItem />);
    expect(baseElement).toBeTruthy();
  });
});
