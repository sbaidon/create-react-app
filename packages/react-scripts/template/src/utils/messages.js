import { defineMessages } from 'react-intl';

export default defineMessages({
  // Required error. Fired when the input is required but the user didn't input anything.
  requiredError: 'Required field',
  // Input error. Fired when the input is expected to be exactly {number} of characters long.
  lengthErrorExact: 'Wrong length. Should be {number} characters long.',
  // Input error. Fired when the input is expected to be max {number} of characters long.
  lengthErrorMax: 'Wrong length. Should be less than {number} characters long.',
  // Input error. Fired when the input is expected to be min {number} of characters long.
  lengthErrorMin:
    'Wrong length. Should be longer than {number} characters long.',
  // Email error. Fired when the input should be an email but fails validation.
  emailError: 'Invalid email',
});
