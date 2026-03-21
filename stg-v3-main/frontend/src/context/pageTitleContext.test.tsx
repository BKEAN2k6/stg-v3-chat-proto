import {useEffect} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {render} from '@testing-library/react';
import {TitleProvider, useTitle} from './pageTitleContext.js';

describe('TitleProvider', () => {
  it('renders without crashing', () => {
    render(
      <TitleProvider>
        <div />
      </TitleProvider>,
    );
  });

  it('sets document title on update', () => {
    vi.spyOn(document, 'title', 'set');
    function Component() {
      const {setTitle} = useTitle();

      useEffect(() => {
        setTitle('Test Title');
      }, [setTitle]);

      return null;
    }

    render(
      <TitleProvider>
        <Component />
      </TitleProvider>,
    );

    expect(document.title).toBe('Test Title | See the Good!');
  });
});

describe('useTitle', () => {
  it('throws an error if used outside TitleProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    function Component() {
      try {
        useTitle();
      } catch (error: any) {
        expect(error.message).toBe(
          'useTitle must be used within a TitleProvider',
        );
      }

      return null;
    }

    render(<Component />);

    spy.mockRestore();
  });
});
