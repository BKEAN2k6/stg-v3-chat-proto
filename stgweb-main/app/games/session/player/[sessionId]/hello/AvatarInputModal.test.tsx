import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom'; // eslint-disable-line import/no-unassigned-import
import {AvatarInputModal} from './AvatarInputModal';

describe('AvtarInputModal', () => {
  it('displays the correct title', () => {
    const {getByText} = render(
      <AvatarInputModal
        isOpen
        locale="fi-FI"
        handleClose={() => jest.fn()}
        avatar="12_melikes"
        setAvatar={() => jest.fn()}
      />,
    );
    expect(getByText('Valitse avatar')).toBeInTheDocument();
  });

  it('calls the setAvatar callback when the set avatar button is clicked', () => {
    const setAvatar = jest.fn();
    const {getByTestId} = render(
      <AvatarInputModal
        isOpen
        locale="en-US"
        handleClose={() => jest.fn()}
        avatar="12_melikes"
        setAvatar={setAvatar}
      />,
    );
    const colorDiv = getByTestId('12_melikes');
    const setButton = getByTestId('set-color-button');
    fireEvent.click(colorDiv);
    fireEvent.click(setButton);
    expect(setAvatar).toHaveBeenCalledWith('12_melikes');
  });

  it('calls the handleClose callback when the close button is clicked', () => {
    const handleClose = jest.fn();
    const {getByTestId} = render(
      <AvatarInputModal
        isOpen
        locale="en-US"
        handleClose={handleClose}
        avatar="12_melikes"
        setAvatar={() => jest.fn()}
      />,
    );
    const closeButton = getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
