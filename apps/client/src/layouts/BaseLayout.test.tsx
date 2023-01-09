import { render, waitFor } from '@testing-library/react';
import { BaseLayout } from './BaseLayout';

describe('BaseLayout', () => {
  it('should render correctly', () => {
    const { baseElement } = render(
      <BaseLayout title="Hello world">
        <></>
      </BaseLayout>
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should show page title', async () => {
    render(
      <BaseLayout title="Hello world">
        <p>Hello</p>
      </BaseLayout>
    );

    await waitFor(() =>
      expect(global.document.title).toStrictEqual('Hello world')
    );
  });
});
