import { render } from '@testing-library/react';

import SimpleCard from './simple-card';

describe('SimpleCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SimpleCard imageAltText="ABC" imageUrl="XYZ" title="MNO" />
    );
    expect(baseElement).toBeTruthy();
  });
});
