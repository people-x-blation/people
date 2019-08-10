import passport from 'passport';
import {Strategy as KakaoStrategy} from 'passport-kakao';

// 로그인이 성공하면, serializeUser 메서드를 이용하여 사용자 정보를 Session에 저장할 수 있다.
passport.serializeUser((user, done) => {
    console.log('serialize',user);
    done(null, user);
});

passport.use(new KakaoStrategy(
    {
        // 유출 주의
        clientID : process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL : 'http://localhost:3000/auth/kakao',
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("profile",profile);
        return done(null, profile);
    }
));

export const kakao = passport.authenticate('kakao', {
    successRedirect: '../board',
    failureRedirect: '../user/login'
})