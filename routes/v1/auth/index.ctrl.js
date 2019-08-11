import passport from 'passport';

export const kakao = async (req, res) => {
  //console.log(req);
  const user = req.user.username;
  console.log(req.user._json.kaccount_email);
  console.log(req.user.id);

  // login 되면 게시판으로들어가고
  //res.render('auth/login');
  //안되면 회원가입창으로 들어감
  //res.render('auth/signup');
};

export const find_pw = (req, res) => {
  res.render('auth/find_pw');
};
export const find_id = (req, res) => {
  res.render('auth/find_id');
};

export const signup = (req, res) => {};
export const login = (req, res) => {};
