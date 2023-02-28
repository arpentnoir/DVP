import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render correctly', () => {
    const { baseElement } = render(
      <MemoryRouter initialEntries={['/test/route']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should display links for each subdirectory except for the last', () => {
    const { queryByText, queryAllByTestId } = render(
      <MemoryRouter initialEntries={['/test/breadcrumbs/path']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    const separators = queryAllByTestId('breadcrumbs-separator');

    expect(queryByText('Home')).toBeInTheDocument();
    expect(queryByText('Home')?.closest('a')).toHaveAttribute('href', '/');

    expect(queryByText('Test')).toBeInTheDocument();
    expect(queryByText('Test')?.closest('a')).toHaveAttribute('href', '/test');

    expect(queryByText('Breadcrumbs')).toBeInTheDocument();
    expect(queryByText('Breadcrumbs')?.closest('a')).toHaveAttribute(
      'href',
      '/test/breadcrumbs'
    );

    expect(separators.length).toBe(3);
    expect(separators[separators.length - 1].parentElement).toHaveStyle(
      'transform: rotate(45deg)'
    );

    expect(queryByText('Path')).not.toBeInTheDocument();
  });

  it('should not display breadcrumbs if on the homepage', () => {
    const { queryByText, queryAllByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(queryByText('Home')).not.toBeInTheDocument();
    expect(queryAllByTestId('breadcrumbs-separator').length).toBe(0);
  });

  it('should only display home link for 1 level deep', () => {
    const { queryByText, queryAllByTestId } = render(
      <MemoryRouter initialEntries={['/test']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    const separators = queryAllByTestId('breadcrumbs-separator');

    expect(queryByText('Home')).toBeInTheDocument();
    expect(queryByText('Home')?.closest('a')).toHaveAttribute('href', '/');

    expect(queryByText('Test')).not.toBeInTheDocument();

    expect(separators.length).toBe(1);
    expect(separators[separators.length - 1].parentElement).toHaveStyle(
      'transform: rotate(45deg)'
    );
  });

  it('should not display a link for the current page', () => {
    const { queryByText } = render(
      <MemoryRouter initialEntries={['/test/documents']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(queryByText('Documents')).not.toBeInTheDocument();
  });

  it('should display a rotated separator as the last element', () => {
    const { queryAllByTestId } = render(
      <MemoryRouter initialEntries={['/test/documents']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    const separators = queryAllByTestId('breadcrumbs-separator');

    expect(separators.length).toBe(2);
    expect(separators[separators.length - 1].parentElement).toHaveStyle(
      'transform: rotate(45deg)'
    );
  });
});
