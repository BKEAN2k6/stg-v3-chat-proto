/* eslint-disable @typescript-eslint/naming-convention */
import {io} from 'socket.io-client';

export const socket = io({transports: ['websocket']});
export const CONNECT = 'connect';
export const JOIN = 'join';
export const LEAVE = 'leave';
