import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '../../../../../../../lib/directus';
import OwnStrength from './page';

const createOneMock = jest.fn(() => ({id: 'test-id'}));
jest.mock('../../../../../../../lib/directus', () => ({
  createClientSideDirectusClient: jest.fn(() => ({
    items: jest.fn(() => ({createOne: createOneMock})),
    users: {
      me: {
        read: jest.fn(() => ({})),
      },
    },
  })),
  refreshAuthIfExpired: jest.fn(),
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: pushMock,
    query: {
      sessionId: 'test-session-id',
    },
  })),
}));

jest.mock('../../../../../../../hooks/use-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getLoggedInUserId: jest.fn(() => 'test-user-id'),
  })),
}));

describe('OwnStrength Component', () => {
  describe('when strength is defined', () => {
    let ownStrength: any;
    beforeEach(() => {
      ownStrength = render(
        <OwnStrength
          params={{sessionId: ''}}
          searchParams={{strength: 'leadership'}}
        />,
      );
    });

    it('shows the strenth definition', () => {
      expect(
        ownStrength.getByText(
          'Leadership means responsibility for the task and the group. A leader takes care of others and shares the work based on strengths in others. A leader makes decisions which affect the success of the whole team.',
        ),
      ).toBeTruthy();
    });

    it('shows the continue button', () => {
      expect(ownStrength.getByText('Continue')).toBeTruthy();
    });
  });

  describe('when strength is not defined', () => {
    let ownStrength: any;
    beforeEach(() => {
      ownStrength = render(
        <OwnStrength
          params={{sessionId: ''}}
          searchParams={{strength: undefined}}
        />,
      );
    });

    it('does not show the continue button', () => {
      expect(ownStrength.queryByText('Continue')).toBeFalsy();
    });
  });

  describe('when continue button is clicked', () => {
    beforeEach(async () => {
      const ownStrength = render(
        <OwnStrength
          params={{sessionId: 'test-session-id'}}
          searchParams={{strength: 'leadership'}}
        />,
      );

      await waitFor(() => fireEvent.click(ownStrength.getByText('Continue')));
    });

    it('creates the Directus client with correct parameters', () => {
      expect(createClientSideDirectusClient).toHaveBeenCalledWith();
    });

    it('refreshes the auth if expired', () => {
      expect(refreshAuthIfExpired).toHaveBeenCalledWith({force: true});
    });

    it('calls Directus client with the correct paramaters', () => {
      expect(createOneMock).toHaveBeenCalledWith({
        is_for_self: true,
        strength: 'ce5f5f41-1a21-493d-93bb-d3f3b201e980',
        strength_session: 'test-session-id',
        user: 'test-user-id',
      });
    });
  });

  describe('when the Directus client call fails', () => {
    let ownStrength: any;

    beforeEach(async () => {
      createOneMock.mockImplementation(() => {
        throw new Error('test-error');
      });
      ownStrength = render(
        <OwnStrength
          params={{sessionId: 'test-session-id'}}
          searchParams={{strength: 'leadership'}}
        />,
      );

      await waitFor(() => fireEvent.click(ownStrength.getByText('Continue')));
    });

    it("changes the continue button text to 'Try again'", () => {
      expect(ownStrength.getByText('Try again')).toBeTruthy();
    });
  });
});
