const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret_key_bebas_diisi_apa_saja';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Akses ditolak. Token tidak ditemukan.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Token tidak valid.',
    });
  }
};

module.exports = verifyToken;
