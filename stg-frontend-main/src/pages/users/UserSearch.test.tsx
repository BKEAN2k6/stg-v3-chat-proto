import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {describe, expect, it, jest} from '@jest/globals';
import UserSearch from './UserSearch';
import {ToastsProvider} from '@/components/toasts';
import {TitleProvider} from '@/context/pageTitleContext';
import api from '@/api/ApiClient';

describe('UserSearch', () => {
  describe('when getUsers throws an error', () => {
    beforeEach(() => {
      jest
        .spyOn(api, 'getUsers')
        .mockRejectedValueOnce(new Error('Test Error'));
      render(
        <TitleProvider>
          <ToastsProvider>
            <UserSearch />
          </ToastsProvider>
        </TitleProvider>,
      );
    });

    it('shows an error message', async () => {
      const searchInput = screen.getByPlaceholderText(
        'Search for a user by first name, last name or email',
      );
      fireEvent.change(searchInput, {target: {value: 'John'}});
      await waitFor(() => {
        expect(
          screen.getByText('Something went wrong while searching for users'),
        ).toBeDefined();
      });
    });
  });

  describe('when getUsers return a list of users', () => {
    beforeEach(() => {
      jest.spyOn(api, 'getUsers').mockResolvedValueOnce([
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          language: 'en',
          isEmailVerified: true,
          avatar: '',
          roles: ['super-admin'],
        },
      ]);
      render(
        <TitleProvider>
          <ToastsProvider>
            <UserSearch />
          </ToastsProvider>
        </TitleProvider>,
      );
    });

    it('the users are shown', async () => {
      const searchInput = screen.getByPlaceholderText(
        'Search for a user by first name, last name or email',
      );
      fireEvent.change(searchInput, {target: {value: 'John'}});
      await waitFor(() => {
        expect(
          screen.getByText('John Doe (john.doe@example.com)'),
        ).toBeDefined();
      });
    });
  });
});
