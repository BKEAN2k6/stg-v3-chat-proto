import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom'; // eslint-disable-line import/no-unassigned-import
import {ColorInputModal} from './ColorInputModal';

describe('ColorInputModal', () => {
  it('displays the correct title', () => {
    const {getByText} = render(
      <ColorInputModal
        isOpen
        locale="fi-FI"
        handleClose={() => jest.fn()}
        color="#000000"
        setColor={() => jest.fn()}
      />,
    );
    expect(getByText('Valitse väri')).toBeInTheDocument();
  });

  it('calls the setColor callback when the set color button is clicked', () => {
    const setColor = jest.fn();
    const {getByTestId} = render(
      <ColorInputModal
        isOpen
        locale="en-US"
        handleClose={() => jest.fn()}
        color="#000000"
        setColor={setColor}
      />,
    );
    const colorDiv = getByTestId('#fdd662');
    const setButton = getByTestId('set-color-button');
    fireEvent.click(colorDiv);
    fireEvent.click(setButton);
    expect(setColor).toHaveBeenCalledWith('#fdd662');
  });

  it('calls the handleClose callback when the close button is clicked', () => {
    const handleClose = jest.fn();
    const {getByTestId} = render(
      <ColorInputModal
        isOpen
        locale="en-US"
        handleClose={handleClose}
        color="#000000"
        setColor={() => jest.fn()}
      />,
    );
    const closeButton = getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
