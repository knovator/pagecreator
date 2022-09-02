import { render } from '@testing-library/react';

import FixedWidget from './fixed-widget';

describe('FixedWidget', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FixedWidget />);
    expect(baseElement).toBeTruthy();
  });
});
