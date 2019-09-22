export const index = async (req, res) => {
  res.render('index', {
    is_logedin: typeof req.session.passport === 'undefined' ? false : true,
  });
};
