const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../middleware/auth.middleware');

exports.signin = async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.password);
    
    if (!user) {
      return res.status(404).send({ message: "Identifiants invalides. Veuillez réessayer." });
    }

    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Identifiants invalides. Veuillez réessayer."
      });
    }

    const token = jwt.sign({ id: user.id, fullname: user.fullname, isAdmin: user.isAdmin },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).send({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) {
    return res.status(403).send({ message: 'Token manquant.' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Token invalide.' });
    }

    if (!decoded.isAdmin) {
      return res.status(403).send({ message: 'Accès refusé.' });
    }
    next();
  });
};