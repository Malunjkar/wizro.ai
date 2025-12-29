import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || process.env.SECRET_KEY || 'sahil_1234';

const verifyToken = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization || req.header('Authorization');

    if (!authHeader) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - No token provided' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Unauthorized - Bad token format' });
    }

    const token = parts[1];

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden - Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default verifyToken;
