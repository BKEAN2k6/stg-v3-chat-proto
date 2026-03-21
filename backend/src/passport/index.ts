import process from 'node:process';
import {RedisStore} from 'connect-redis';
import {type Redis} from 'ioredis';
import session, {type SessionOptions} from 'express-session';
import {type Server} from 'socket.io';
import {type Router} from 'express';
import passport from 'passport';
import {User} from '../models/index.js';

const setUpPassport = (app: Router, io: Server, redis: Redis) => {
  const sessionSettings: SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
      client: redis,
      prefix: 'stg-backend:',
    }),
  };
  if (process.env.NODE_ENV === 'production') {
    sessionSettings.cookie = {
      ...sessionSettings.cookie,
      secure: true,
    };
  }

  if (process.env.NODE_ENV === 'test') {
    sessionSettings.secret = 'test-secret';
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  io.engine.use(session(sessionSettings));
  io.engine.use(passport.initialize());
  io.engine.use(passport.session());

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};

export default setUpPassport;
