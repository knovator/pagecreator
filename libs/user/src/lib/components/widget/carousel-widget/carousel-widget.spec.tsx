import { render } from '@testing-library/react';

import CarouselWidget from './carousel-widget';

describe('CarouselWidget', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CarouselWidget />);
    expect(baseElement).toBeTruthy();
  });
});
