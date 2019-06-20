import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import router from './routes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import createError from 'http-errors';

const app = express();

dotenv.config({
  path: path.join(__dirname, `./.env.${process.env.NODE_ENV || 'development'}`),
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
