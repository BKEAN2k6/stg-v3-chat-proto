import React, {type ReactElement} from 'react';
import {act, fireEvent, render} from '@testing-library/react';
// eslint-disable-next-line import/no-unassigned-import
import 'intersection-observer';
import IndexPage from './page';

jest.mock('next/navigation', () => ({useRouter: jest.fn()}));
jest.mock('next-client-cookies/server', () => ({
  getCookies() {
    return {get: jest.fn()};
  },
}));
jest.mock('@/lib/server-only-utils', () => ({
  serverDataQueryWrapper: jest.fn(),
}));

async function resolvedComponent<Props>(
  component: (props: Props) => Promise<ReactElement<Props>>,
  props: Props,
): Promise<() => ReactElement<Props>> {
  const ComponentResolved = await component(props);
  return () => ComponentResolved;
}

it('renders without crashing', async () => {
  await act(async () => {
    fireEvent(window, new Event('resize'));
    const IndexPageResolved = await resolvedComponent(IndexPage, {});
    const indexPage = render(<IndexPageResolved />);
    expect(indexPage).toBeTruthy();
  });
});
