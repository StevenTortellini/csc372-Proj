async function register(req, res) {
  // TODO: hash password, insert user
  res.json({ ok: true, message: "register placeholder" });
}

async function login(req, res) {
  // TODO: verify, create session/JWT
  res.json({ ok: true, message: "login placeholder" });
}

module.exports = { register, login };
