/**
 * Middleware to check if a user is logged in.
 * Redirects authenticated users to the home page.
 * Renders the login page with a title and no error message for unauthenticated users.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

export const isUserloggedIn = async (req, res, next) => {  
    if (req.session.users !== undefined) {
        next();
    }
    else{
      res.redirect('/login')
    }
};
export const isUserLoggedOut = (req, res, next) => {
  if (req.session.users) {
    return res.redirect('/');
  }
  next();
};