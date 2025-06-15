export const isAdminloggedIn = async (req, res, next) => {  
    if (req.session.admin !== undefined) {
        next();
    }
    else{
      res.redirect('/admin/login')
    }

};
export const isAdminLoggedOut = (req, res, next) => {
  if (req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  next();
};