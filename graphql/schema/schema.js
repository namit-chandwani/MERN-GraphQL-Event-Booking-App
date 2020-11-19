const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 12;

const Event = require("../../models/event.model");
const User = require("../../models/user.model");
const Booking = require("../../models/booking.model");

const eventType = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    date: { type: GraphQLString },
    creator: {
      type: userType,
      resolve(parent, args) {
        return User.findById(parent.creator)
          .then((user) => ({
            ...user._doc,
            password: null,
          }))
          .catch((err) => console.log(err));
      },
    },
  }),
});

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    createdEvents: {
      type: new GraphQLList(eventType),
      resolve(parent, args) {
        return parent.createdEvents.map((eventId) => Event.findById(eventId));
      },
    },
  }),
});

const bookingType = new GraphQLObjectType({
  name: "Booking",
  fields: () => ({
    _id: { type: GraphQLID },
    event: {
      type: eventType,
      resolve(parent, args) {
        return Event.findById(parent.event);
      },
    },
    user: {
      type: userType,
      resolve(parent, args) {
        return User.findById(parent.user).then((user) => {
          return { ...user._doc, password: null };
        });
      },
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const authDataType = new GraphQLObjectType({
  name: "AuthData",
  fields: () => ({
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    events: {
      type: new GraphQLList(eventType),
      resolve(parent, args) {
        return Event.find();
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve(parent, args) {
        return User.find()
          .then((users) => {
            return users.map((user) => ({ ...user._doc, password: null }));
          })
          .catch((err) => console.log(err));
      },
    },
    bookings: {
      type: new GraphQLList(bookingType),
      resolve(parent, args, req) {
        if (!req.isAuth) {
          throw new Error("Unauthenticated");
        }
        return Booking.find();
      },
    },
    event: {
      type: eventType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return Event.findById(args._id);
      },
    },
    user: {
      type: userType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args._id)
          .then((user) => ({
            ...user._doc,
            password: null,
          }))
          .catch((err) => console.log(err));
      },
    },
    booking: {
      type: bookingType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args, req) {
        if (!req.isAuth) {
          throw new Error("Unauthenticated");
        }
        return Booking.findById(args._id);
      },
    },
    login: {
      type: authDataType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.findOne({ email: args.email })
          .then((user) => {
            if (!user) {
              throw new Error("User not found");
            }
            return bcrypt
              .compare(args.password, user.password)
              .then((result) => {
                if (!result) {
                  throw new Error("Incorrect Password");
                }
                // return { ...user._doc, password: null };
                const token = jwt.sign(
                  { userId: user._id },
                  process.env.JWT_SECRET_KEY,
                  {
                    expiresIn: "1h",
                  }
                );

                return {
                  userId: user._id,
                  token: token,
                  tokenExpiration: 1,
                };
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    register: {
      type: userType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.findOne({ email: args.email })
          .then((user) => {
            if (user) {
              throw new Error("User already exists!");
            }
            return bcrypt
              .hash(args.password, saltRounds)
              .then((hashedPwd) => {
                const newUser = new User({
                  email: args.email,
                  password: hashedPwd,
                  createdEvents: [],
                });
                return newUser
                  .save()
                  .then((user) => {
                    return { ...user._doc, password: null };
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      },
    },
    addEvent: {
      type: eventType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        date: { type: GraphQLString },
      },
      resolve(parent, args, req) {
        if (!req.isAuth) {
          throw new Error("Unauthenticated");
        }
        const newEvent = new Event({
          title: args.title,
          description: args.description,
          price: args.price,
          date: args.date,
          creator: req.userId,
        });
        return newEvent
          .save()
          .then((event) => {
            User.findById(req.userId)
              .then((user) => {
                user.createdEvents.push(event._id);
                user.save();
                return event;
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      },
    },
    addBooking: {
      type: bookingType,
      args: {
        event: { type: GraphQLString },
      },
      resolve(parent, args, req) {
        if (!req.isAuth) {
          throw new Error("Unauthenticated");
        }
        const newBooking = new Booking({
          event: args.event,
          user: req.userId,
        });
        return newBooking.save();
      },
    },
    cancelBooking: {
      type: bookingType,
      args: {
        _id: { type: GraphQLID },
      },
      resolve(parent, args, req) {
        if (!req.isAuth) {
          throw new Error("Unauthenticated");
        }
        return Booking.findByIdAndDelete(args._id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
