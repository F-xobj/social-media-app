const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log(`MongoDB Connected ${res}`);

    return server.listen({ port: 5050 }).then((res) => {
      console.log(`Server run at port ${res.url}  and port ${res.port}`);
    });
  });
