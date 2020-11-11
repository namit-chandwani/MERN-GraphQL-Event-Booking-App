const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./graphql/schema/schema");

const app = express();
require("dotenv").config();

const PORT = 5000 || process.env.PORT;

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database!");
    app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
  })
  .catch((err) => console.log(err));
