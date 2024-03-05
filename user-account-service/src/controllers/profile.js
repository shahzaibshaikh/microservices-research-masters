const profile = (req, res) => {
  // The user information is already attached to the request by the Auth middleware
  const user = req.user;

  // You can now use the user information as needed
  res.json({ user, message: "Signin verified successfully" });
};

module.exports = profile;
