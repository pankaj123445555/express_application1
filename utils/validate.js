const validateUpdateProfileBody = (user) => {
  console.log("user", user);
  const allowedField = [
    "firstName",
    "lastName",
    "skills",
    "age",
    "gender",
    "profilePic",
  ];

  const isAllowed = Object.keys(user).every((item) =>
    allowedField.includes(item)
  );

  return isAllowed;
};

module.exports = { validateUpdateProfileBody };
