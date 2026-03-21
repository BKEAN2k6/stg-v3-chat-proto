import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {UserListDialog} from './UserListDialog';

describe('UserListDialog', () => {
  describe('when close button is clicked', () => {
    it('calls close', () => {
      const closeMock = jest.fn();
      const userListDialog = render(
        <UserListDialog
          isOpen
          locale="en-US"
          users={[]}
          close={closeMock}
          removeUser={jest.fn()}
        />,
      );
      fireEvent.click(userListDialog.getByTestId('close-button'));
      expect(closeMock).toHaveBeenCalled();
    });
  });

  describe('when user remove button is clicked', () => {
    it('calls removeUser', () => {
      const removeUserMock = jest.fn();
      const userListDialog = render(
        <UserListDialog
          isOpen
          locale="en-US"
          users={[
            {
              id: 'test-user-id',
              first_name: 'Test User',
              color: 'test-color',
            },
          ]}
          close={jest.fn()}
          removeUser={removeUserMock}
        />,
      );
      fireEvent.click(userListDialog.getByText('Remove'));
      expect(removeUserMock).toHaveBeenCalledWith({
        color: 'test-color',
        first_name: 'Test User',
        id: 'test-user-id',
      });
    });
  });
});
