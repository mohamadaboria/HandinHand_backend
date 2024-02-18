const { expressjwt: expressJwt } = require("express-jwt");

const authJwt = () => {
  const secret = process.env.secret;
  const api = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/users(.*)/, methods: ["GET", "OPTIONS"] },

      `${api}/users/register`,
      `${api}/users/login`,
    ],
  });
};

module.exports = {
  authJwt,
};
