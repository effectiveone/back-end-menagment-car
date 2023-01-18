const postLogout = (req, res) => {
  try {
    req.user = null;
    res.status(200).send("User successfully logged out");
  } catch (err) {
    res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = postLogout;
