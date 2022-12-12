import { render } from '@testing-library/react';
import React from 'react';
import { BaseApp } from './BaseApp';

describe('BaseApp', () => {
  it('should render successfully', () => {
    render(<BaseApp />);
  });
});
