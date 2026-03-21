import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {StrengthDialog} from './StrengthDialog';

describe('StrengthDialog', () => {
  describe('when close button is clicked', () => {
    it('calls close', () => {
      const closeMock = jest.fn();
      const userListDialog = render(
        <StrengthDialog slug="kindness" locale="en-US" close={closeMock} />,
      );
      fireEvent.click(userListDialog.getByTestId('close-button'));
      expect(closeMock).toHaveBeenCalled();
    });
  });
  describe('when primary button is clicked', () => {
    it('calls close', () => {
      const closeMock = jest.fn();
      const userListDialog = render(
        <StrengthDialog slug="kindness" locale="en-US" close={closeMock} />,
      );
      fireEvent.click(userListDialog.getByTestId('primary-button'));
      expect(closeMock).toHaveBeenCalled();
    });
  });
});
