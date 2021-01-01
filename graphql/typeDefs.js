const gql = require("graphql-tag");

module.exports = gql`
  type Post {
    body: String!
    createdAt: String!
    id: ID!
    username: String!
  }

  type Query {
    getPosts: [Post]
  }
`;
