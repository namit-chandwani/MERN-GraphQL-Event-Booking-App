const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");

const eventList = [
  {
    id: "1",
    title: "Cricket",
    description: "ipl",
    price: 12.46,
    date: "05/11/2020",
    // createdId: "2",
    // bookedIdList: ["1", "3"],
  },
  {
    id: "2",
    title: "Football",
    description: "fifa",
    price: 99.3,
    date: "17/03/2021",
    // createdId: "3",
    // bookedIdList: ["2"],
  },
  {
    id: "3",
    title: "Basketball",
    description: "nba",
    price: 40,
    date: "31/12/2020",
    // createdId: "2",
    // bookedIdList: ["1"],
  },
];
const userList = [
  {
    id: "1",
    email: "virat@gmail.com",
    password: "313434",
    bookedIdList: ["1", "2"],
    createdIdList: ["3"],
  },
  {
    id: "2",
    email: "chris@gmail.com",
    password: "478531",
    bookedIdList: ["3"],
    createdIdList: ["1"],
  },
  {
    id: "3",
    email: "abraham@gmail.com",
    password: "8932486",
    bookedIdList: ["1", "2", "3"],
    createdIdList: [],
  },
];

const EventType = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
    date: {
      type: GraphQLString,
    },
    // createdBy: {
    //   type: UserType,
    //   resolve(parent, args) {
    //     return userList.find((user) => user.id === parent.createdId);
    //   },
    // },
    // bookedBy: {
    //   type: new GraphQLList(UserType),
    //   resolve(parent, args) {
    //     return userList.filter((user) => parent.bookedIdList.includes(user.id));
    //   },
    // },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    eventsBooked: {
      type: new GraphQLList(EventType),
      resolve(parent, args) {
        return eventList.filter((event) =>
          parent.bookedIdList.includes(event.id)
        );
      },
    },
    eventsCreated: {
      type: new GraphQLList(EventType),
      resolve(parent, args) {
        return eventList.filter((event) =>
          parent.createdIdList.includes(event.id)
        );
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    events: {
      type: new GraphQLList(EventType),
      resolve(parent, args) {
        return eventList;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return userList;
      },
    },
    event: {
      type: EventType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return eventList.find((event) => event.id === args.id);
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return userList.find((user) => user.id === args.id);
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    createEvent: {
      type: EventType,
      args: {
        title: {
          type: GraphQLString,
        },
        description: {
          type: GraphQLString,
        },
        price: {
          type: GraphQLFloat,
        },
        date: {
          type: GraphQLString,
        },
      },
      resolve(parent, args) {
        const newEvent = {
          id: Math.random().toString(),
          title: args.title,
          description: args.description,
          price: args.price,
          date: args.date,
        };
        eventList.push(newEvent);
        return newEvent;
      },
    },
    createUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
        email: {
          type: GraphQLString,
        },
        password: {
          type: GraphQLString,
        },
        // eventsBooked: {
        //   type: new GraphQLList(EventType),
        // },
        // eventsCreated: {
        //   type: new GraphQLList(EventType),
        // },
      },
      resolve(parent, args) {
        const newUser = {
          id: Math.random().toString(),
          email: args.email,
          password: args.password,
          eventsBooked: args.eventsBooked,
          eventsCreated: args.eventsCreated,
        };
        userList.push(newUser);
        return newUser;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });

module.exports = schema;
