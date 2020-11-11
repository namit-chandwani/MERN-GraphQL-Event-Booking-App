const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");

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
        return User.findById(parent.creator);
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
        return User.findById(parent.user);
      },
    },
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
        return User.find();
      },
    },
    bookings: {
      type: new GraphQLList(bookingType),
      resolve(parent, args) {
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
        return User.findById(args._id);
      },
    },
    booking: {
      type: bookingType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return Booking.findById(args._id);
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    addUser: {
      type: userType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        createdEvents: {
          type: new GraphQLList(GraphQLString),
        },
      },
      resolve(parent, args) {
        const newUser = new User({
          email: args.email,
          password: args.password,
          createdEvents: args.createdEvents,
        });
        return newUser.save();
      },
    },
    addEvent: {
      type: eventType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        date: { type: GraphQLString },
        creator: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newEvent = new Event({
          title: args.title,
          description: args.description,
          price: args.price,
          date: args.date,
          creator: args.creator,
        });
        return newEvent.save();
      },
    },
    addBooking: {
      type: bookingType,
      args: {
        event: { type: GraphQLString },
        user: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newBooking = new Booking({
          event: args.event,
          user: args.user,
        });
        return newBooking.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
