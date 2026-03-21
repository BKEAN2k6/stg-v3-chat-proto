import {expect, it, describe, beforeEach, jest} from '@jest/globals';
import AccessController from './AccessController';

describe('AccessController', () => {
  let accessController: AccessController;

  beforeEach(() => {
    accessController = new AccessController(
      {
        async controller() {}, // eslint-disable-line @typescript-eslint/no-empty-function
        access: ['public'],
        query: {
          type: 'object',
          properties: {
            requiredTestQueryParameter: {type: 'string'},
            nonrequiredTestQueryParameter: {type: 'string'},
          },
          required: ['requiredTestQueryParameter'],
        },
        request: {
          type: 'object',
          properties: {
            requiredTestRequestField: {type: 'string'},
            nonRequiredTestRequestField: {type: 'string'},
          },
          required: ['requiredTestRequestField'],
        },
        response: {
          type: 'object',
          properties: {
            requiredTestResponseField: {type: 'string'},
            nonRequiredTestResponseField: {type: 'string'},
          },
          required: ['requiredTestResponseField'],
        },
      },
      {log: jest.fn()},
    );
  });

  describe('filterRead', () => {
    describe('when response contains all required fields', () => {
      it('returns the response', () => {
        const response = {
          requiredTestResponseField: 'requiredTestResponseField',
          nonRequiredTestResponseField: 'nonRequiredTestResponseField',
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = accessController.filterRead(response);

        expect(result).toEqual(response);
      });
    });

    describe('when response contains fields that are not defined in the schema', () => {
      it('removes the fields that are not defined in the schema', () => {
        const response = {
          requiredTestResponseField: 'requiredTestResponseField',
          nonRequiredTestResponseField: 'nonRequiredTestResponseField',
          nonDefinedTestResponseField: 'nonDefinedTestResponseField',
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = accessController.filterRead(response);

        expect(result).toEqual({
          requiredTestResponseField: 'requiredTestResponseField',
          nonRequiredTestResponseField: 'nonRequiredTestResponseField',
        });
      });
    });

    describe('when response does not contain all required fields', () => {
      it('throws an error', () => {
        const response = {
          nonRequiredTestResponseField: 'nonrequiredTestResponseField',
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        expect(() => accessController.filterRead(response)).toThrowError();
      });
    });

    describe('when response is an error object', () => {
      it('return the error object', () => {
        const response = {
          error: 'error',
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = accessController.filterRead(response);

        expect(result).toEqual(response);
      });
    });
  });

  describe('restrictPath', () => {
    describe('when the user has access to the path', () => {
      it('does not throw an error', () => {
        expect(() => {
          accessController.restrictPath(['public']);
        }).not.toThrow();
      });
    });

    describe('when the user does not have access to the path', () => {
      it('throws an error', () => {
        expect(() => {
          accessController.restrictPath(['notpublic']);
        }).toThrowError();
      });
    });
  });

  describe('restrictQuery', () => {
    describe('when request contains all required fields', () => {
      it('does not throw an error', () => {
        const request = {
          requiredTestQueryParameter: 'requiredTestQueryParameter',
          nonRequiredTestQueryParameter: 'nonRequiredTestQueryParameter',
        };

        expect(() => {
          accessController.restrictQuery(request);
        }).not.toThrow();
      });
    });

    describe('when request does not contain all required fields', () => {
      it('throws an error', () => {
        const request = {
          nonRequiredTestQueryParameter: 'nonRequiredTestQueryParameter',
        };

        expect(() => {
          accessController.restrictQuery(request);
        }).toThrow();
      });
    });
  });

  describe('restrictWrite', () => {
    describe('when request contains all required fields', () => {
      it('does not throw an error', () => {
        const request = {
          requiredTestRequestField: 'requiredTestRequestField',
          nonRequiredTestRequestField: 'nonRequiredTestRequestField',
        };

        expect(() => {
          accessController.restrictWrite(request);
        }).not.toThrow();
      });
    });

    describe('when request does not contain all required fields', () => {
      it('throws an error', () => {
        const request = {
          nonRequiredTestRequestField: 'nonRequiredTestRequestField',
        };

        expect(() => {
          accessController.restrictWrite(request);
        }).toThrow();
      });
    });
  });
});
