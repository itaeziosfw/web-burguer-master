import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

function authMiddlewares(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error();
      }

      request.userId = decoded.id;
      request.UserName = decoded.name;

      return next();
    });
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return response.status(401).json({ error: 'Token invalid' });
  }
}

export default authMiddlewares;