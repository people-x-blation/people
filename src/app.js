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

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
app.use('/', router);

export default app;
