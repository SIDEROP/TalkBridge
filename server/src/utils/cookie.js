import cookie from 'cookie';

export const setCookie = (res, name, value, options = {}) => {
  const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    expires: options.expires || new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: '/',
    ...options, 
  };

  res.setHeader('Set-Cookie', cookie.serialize(name, value, cookieOptions));
};

export const getCookie = (req, name) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies[name] || null;
};

export const clearCookie = (res, name) => {
  res.setHeader('Set-Cookie', cookie.serialize(name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), 
    path: '/'
  }));
};
