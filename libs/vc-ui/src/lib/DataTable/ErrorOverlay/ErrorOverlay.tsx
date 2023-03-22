/**
* @module ErrorOverlay
* @description This module exports the ErrorOverlay component which renders
  an error message overlay.
*/
import { Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { DEFAULT_TABLE_ERROR_MESSAGE } from '../../constants';
import { Text } from '../../Text';

/**
* @typedef IErrorOverlay
* @type {object}
* @property {string} [errorMessage] - The error message to be displayed. Defaults to
  the value of DEFAULT_TABLE_ERROR_MESSAGE.
*/
interface IErrorOverlay {
  errorMessage?: string;
}

export const errorMessageTestId = 'text:table-error-message';

/**
 * @function ErrorOverlay
 * @description A functional React component that renders an error message overlay.
 * @param {IErrorOverlay} props - The props to configure the ErrorOverlay component.
 * @returns {JSX.Element} The rendered ErrorOverlay component.
 */
export const ErrorOverlay = ({
  errorMessage = DEFAULT_TABLE_ERROR_MESSAGE,
}: IErrorOverlay) => {
  const errorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (errorMessage && errorRef?.current) {
      errorRef.current.focus();
    }
  }, [errorMessage]);

  return (
    <Stack justifyContent="center" alignItems="center" height="100%">
      <Text ref={errorRef} data-testid={errorMessageTestId}>
        {errorMessage}
      </Text>
    </Stack>
  );
};
