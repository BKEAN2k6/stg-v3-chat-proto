import {jest, expect, it, describe, beforeEach} from '@jest/globals';
import RolesResolver from '../middleware/roles';
import {SocketManager} from './index';

describe('SocketManager', () => {
  describe('emit', () => {
    let socketManager: SocketManager;
    let emit: jest.Mock;

    beforeEach(() => {
      emit = jest.fn();
      socketManager = new SocketManager(
        {log: jest.fn()},
        new RolesResolver({log: jest.fn()}),
        {
          on: jest.fn(),
          to: () => ({emit}),
        },
        [
          {
            path: '/test/:id',
            name: 'Test',
            access: ['public'],
            events: {
              update: {
                type: 'object',
                properties: {
                  test: {type: 'string'},
                },
                required: ['test'],
              },
            },
          },
        ],
      );
    });

    describe('when the event config does not exist', () => {
      it('throws an error', async () => {
        await expect(async () => {
          await socketManager.emit('/test/1', 'create', {});
        }).rejects.toThrow(
          "No room '/test/1' and event 'create' combination found",
        );
        expect(emit).not.toHaveBeenCalled();
      });
    });

    describe('when the config exists but data is not valid', () => {
      it('throws an error', async () => {
        await expect(async () => {
          await socketManager.emit('/test/1', 'update', {});
        }).rejects.toThrow('Event data validation failed');
        expect(emit).not.toHaveBeenCalled();
      });
    });

    describe('when the data is valit', () => {
      beforeEach(async () => {
        await socketManager.emit('/test/1', 'update', {
          test: 'test',
          foo: 'bar',
        });
      });

      it('emits the event', async () => {
        expect(emit).toHaveBeenCalledWith('UpdateTestEvent', {test: 'test'});
      });
    });
  });
});
