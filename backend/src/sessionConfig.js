import session from 'express-session';

export const sessionMiddleware = session({
  secret: 'the secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
});
