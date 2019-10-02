import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import passportConfig from 'lib/kakao';
import { findOne } from 'db/query';

const app = express();

dotenv.config({
  path: path.join(__dirname, `/.env.${process.env.NODE_ENV || 'development'}`),
});
import passport from 'passport';
import session from 'express-session';
import router from './routes';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// jQuery
app.use(
  '/jquery',
  express.static(path.join(__dirname, '/node_modules/jquery/dist')),
);
// AOS
app.use('/aos', express.static(path.join(__dirname, '/node_modules/aos/dist')));

// Session
app.use(
  session({
    secret: 'a!@szkldhsdf123963', //배포시에는 다른 키보드캣으로 넣기
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(passport.session());
passportConfig(app, passport);
// route
app.use(async (req, res, next) => {
  res.locals.user = req.user;
  if (req.user) {
    const isSignup = await findOne(req.user.id);
    if (!isSignup.rows[0].nickname) {
      if (!req.url.includes('auth')) {
        res.redirect('/auth/kakao');
      }
    }
  }
  next();
});

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
