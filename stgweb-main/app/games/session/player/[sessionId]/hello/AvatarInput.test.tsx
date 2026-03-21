import React from 'react';
import '@testing-library/jest-dom'; // eslint-disable-line import/no-unassigned-import
import {render, fireEvent} from '@testing-library/react';
import {AvatarInput} from './AvatarInput';

describe('AvatarInput', () => {
  it('should not show modal when button is not clicked', () => {
    const {queryByTestId} = render(
      <AvatarInput
        avatar="12_melikes"
        setAvatar={() => jest.fn()}
        isLoading={false}
      />,
    );
    expect(queryByTestId('color-input-modal')).not.toBeInTheDocument();
  });

  it('should open modal when button is clicked', () => {
    const {getByTestId, queryByTestId} = render(
      <AvatarInput
        avatar="12_melikes"
        setAvatar={() => jest.fn()}
        isLoading={false}
      />,
    );
    const button = getByTestId('color-input-button');
    fireEvent.click(button);
    expect(queryByTestId('color-input-modal')).toBeInTheDocument();
  });
});
