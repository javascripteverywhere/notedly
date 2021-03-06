const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const helmet = require('helmet');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
require('dotenv').config();

const db = require('./db');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const authInit = require('./auth');
const authRoutes = require('./routes/auth');
const models = require('./models');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

// Connect to our database
db.connect(DB_HOST);

// Apply security and CORS middleware
app.use(helmet());
app.use(cors());

// User Sessions
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: DB_HOST,
      autoReconnect: true
    })
  })
);

// Authentication
authInit(models);
app.use(passport.initialize());
app.use(authRoutes);

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: async ({ req }) => {
    const user = req.session.user || '';
    // add the db models and the user to the context
    return { models, user };
  }
});

server.applyMiddleware({ app, path: '/api' });

// Start Express server on port 4000 or the port specified in .env
const expressServer = app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:4000${server.graphqlPath}`
  )
);

// Set a timeout as a first line of defense against malicious queries
expressServer.setTimeout(5000);
