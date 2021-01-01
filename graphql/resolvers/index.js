const postsResolvers = require("./posts");
const usersResolvers = require("./posts");

module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
};
