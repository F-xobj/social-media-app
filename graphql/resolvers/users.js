const bcyrpt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const { validateRegister ,validateLogin} = require("../../utils/validator");

function generateToken(user) {
  return JWT.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLogin(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const isUser = await User.findOne({ username });

      if (!isUser) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const isMatch = await bcyrpt.compare(password, isUser.password);

      if (!isMatch) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(isUser);

      return {
        ...isUser._doc,
        id: isUser._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, password, email, confirmPassword } },
      context,
      info
    ) {
      //Todo Hash password and create an auth token
      const { valid, errors } = validateRegister(
        username,
        password,
        email,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const isUser = await User.findOne({ username });

      if (isUser) {
        throw new UserInputError(`Username ${username} is taken`, {
          errors: {
            username: `${username} is taken`,
          },
        });
      }

      password = await bcyrpt.hash(password, 12);
      const newUser = new User({
        username,
        password,
        email,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      console.log("🚀 ~ file: users.js ~ line 28 ~ res", res);

      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
