import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {describe, expect, it, jest} from '@jest/globals';
import UserEditForm from './UserEditForm';
import {ToastsProvider} from '@/components/toasts';
import api from '@/api/ApiClient';

describe('UserEditForm', () => {
  const roles: Array<'super-admin'> = ['super-admin'];
  const mockProps = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isEmailVerified: true,
    roles,
  };

  describe('when UserEditForm is rendered', () => {
    beforeEach(() => {
      render(
        <ToastsProvider>
          <UserEditForm {...mockProps} />
        </ToastsProvider>,
      );
    });

    it('contains the expected form elements with correct values', () => {
      expect(screen.getByLabelText('First name')).toHaveProperty(
        'value',
        'John',
      );
      expect(screen.getByLabelText('Last name')).toHaveProperty('value', 'Doe');
      expect(screen.getByLabelText('Email')).toHaveProperty(
        'value',
        'john.doe@example.com',
      );
      expect(screen.getByLabelText('Super Admin')).toHaveProperty(
        'checked',
        true,
      );
      expect(screen.getByLabelText('Email verified')).toHaveProperty(
        'checked',
        true,
      );
    });
  });

  describe('when updateUser throws an error', () => {
    beforeEach(() => {
      jest
        .spyOn(api, 'updateUser')
        .mockRejectedValueOnce(new Error('Test Error'));
      render(
        <ToastsProvider>
          <UserEditForm {...mockProps} />
        </ToastsProvider>,
      );
    });

    it('shows an error message', async () => {
      fireEvent.submit(screen.getByRole('button', {name: /save/i}));
      await waitFor(() => {
        expect(
          screen.getByText('Something went wrong while saving the user'),
        ).toBeDefined();
      });
    });
  });

  describe('when updateUser succeeds', () => {
    beforeEach(() => {
      jest.spyOn(api, 'updateUser').mockResolvedValueOnce({
        firstName: 'John',
        lastName: 'Doe',
        email: '',
        language: 'en',
        isEmailVerified: true,
        roles: [],
      });

      render(
        <ToastsProvider>
          <UserEditForm {...mockProps} />
        </ToastsProvider>,
      );
    });

    it('shows a success message', async () => {
      fireEvent.submit(screen.getByRole('button', {name: /save/i}));

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeDefined();
      });
    });
  });
});
