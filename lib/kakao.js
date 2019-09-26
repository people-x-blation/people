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
        callbackURL: process.env.KAKAO_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const cipher = crypto.createCipher(
          'aes-256-cbc',
          process.env.CRYPTO_SECRETKEY,
        );
        let c_input = cipher.update(email, 'utf8', 'base64');
        c_input += cipher.final('base64');
        const isUser = await findOne(c_input);
        if (isUser == undefined) {
          return res.status(401);
        } else if (isUser.rows.length == 0) {
          const new_member = Object.assign(member);
          new_member.id = profile.id.toString();
          new_member.email = profile._json.kaccount_email;
          console.log(new_member);
          await insert(`'${Object.values(new_member).join(`', '`)}'`, 'member');
          // await insert(``, 'member');
          //실패할시에 401 에러 리턴 추후
        }

        return done(null, profile);
      },
    ),
  );
};
