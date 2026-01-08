import passport from 'passport';
import session from 'express-session';

// Session configuration (must match the one in index.js)
const sessionConfig = {
  secret: 'the secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
};

const sessionMiddleware = session(sessionConfig);

const socketAuthMiddleware = (socket, next) => {
  // Apply session middleware to the socket request
  sessionMiddleware(socket.request, socket.request.res || {}, (err) => {
    if (err) {
      return next(err);
    }

    // Initialize Passport
    passport.initialize()(socket.request, socket.request.res || {}, () => {
      // Authenticate session
      passport.session()(socket.request, socket.request.res || {}, (err) => {
        if (err) {
          return next(err);
        }

        // Check if user is authenticated
        if (socket.request.user) {
          socket.user = socket.request.user; // Attach user to socket
          return next();
        } else {
          return next(new Error('Unauthorized'));
        }
      });
    });
  });
};

export default socketAuthMiddleware;