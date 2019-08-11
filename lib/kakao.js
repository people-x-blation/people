import kakaoStrategy from 'passport-kakao';

const Kakao = kakaoStrategy.Strategy;
export default (app, passport) => {
  passport.serializeUser((user, done) => {
    console.log('serialize', user);
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    console.log('deserialize', user);
    done(null, user);
  });

  passport.use(
    new Kakao(
      {
        // 유출 주의
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/kakao',
      },
      async (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      },
    ),
  );
};
