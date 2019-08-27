import passport from 'passport';
export default (req, res, next) => {
  if (req.isAuthenticated() || req.url == '/kakao') {
    next();
  } else {
    if (req.session) {
      req.session.redirectUrl =
        req.query.requestUrl ||
        req.originalUrl ||
        req.headers.referer ||
        req.url;
      res.redirect('/auth/kakao');
    }
  }
};
