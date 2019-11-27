import kakaoStrategy from 'passport-kakao';
import { findOne, insert } from '~/db/query';
import { Member } from '~/db/model';
import { aes } from '~/util/crypto';

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
        callbackURL: process.env.KAKAO_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const c_input = profile.id;
        const isUser = await findOne(c_input);
        const email =
          typeof profile._json.kaccount_email === undefined
            ? '카카오톡에 연동된 email 없음'
            : profile._json.kaccount_email;

        if (isUser == undefined) {
          return res.status(401);
        } else if (isUser.rows.length == 0) {
          const new_member = new Member();
          new_member.id = c_input.toString();
          new_member.email = email;
          await insert(
            `'${Object.values(new_member).join(`', '`)}'`,
            'member',
            '',
            `(${Object.keys(new_member).join(',')})`,
          );
          // await insert(``, 'member');
          //실패할시에 401 에러 리턴 추후
        }

        return done(null, profile);
      },
    ),
  );
};
