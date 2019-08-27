import kakaoStrategy from 'passport-kakao';
import { findOne, insert } from '~/db/query';
import { member } from '~/db/model';

const Kakao = kakaoStrategy.Strategy;
export default (app, passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new Kakao(
      {
        // 유출 주의
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const isUser = await findOne(profile._json.kaccount_email);
        if (isUser.rows.length == 0) {
          const new_member = member;
          new_member.id = profile.id.toString();
          new_member.email = profile._json.kaccount_email;
          insert(`'${Object.values(new_member).join(`', '`)}'`, 'member');
          //실패할시에 401 에러 리턴 추후
        }

        return done(null, profile);
      },
    ),
  );
};
