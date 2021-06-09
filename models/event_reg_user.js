const mongodb = require("mongodb");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const EventRegUser = new GraphQLObjectType({
  name: "EventRegUser",
  description: "Event Registered Users",
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    event_id: {
      type: GraphQLNonNull(GraphQLID),
    },
    user_id: {
      type: GraphQLNonNull(GraphQLID),
    },
    datetime: {
      type: GraphQLNonNull(GraphQLString),
    },
  }),
});

async function loadDataBase() {
  const client = await mongodb.MongoClient.connect(
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  return client.db("eventmng").collection("event_reg_users");
}

const EventRegUserType = {
  type: new GraphQLList(EventRegUser),
  description: "Event Registered Users",
  resolve: async () => {
    let event_reg_user_col = await loadDataBase();
    return event_reg_user_col.find().toArray();
  },
};

const RegisterUser = {
  type: EventRegUser,
  description: "Register a user for the event",
  args: {
    event_id: {
      type: GraphQLNonNull(GraphQLID),
    },
    user_name: {
      type: GraphQLNonNull(GraphQLString),
    },
    business_name: {
      type: GraphQLNonNull(GraphQLString),
    },
    business_type: {
      type: GraphQLNonNull(GraphQLString),
    },
    contact_num: {
      type: GraphQLNonNull(GraphQLString),
    },
    user_emailid: {
      type: GraphQLNonNull(GraphQLString),
    },
    user_address: {
      type: GraphQLNonNull(GraphQLString),
    },
    user_city: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (parent, args) => {
    
    const client = await mongodb.MongoClient.connect(
      "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    var db = client.db("eventmng");

    // check if event exist
    let event = await db.collection("events").findOne({
      _id: mongodb.ObjectID(args.event_id),
      e_status: "active"
    });
    if(!event) {
      return {
        _id: "event404",
        event_id: "event404",
        user_id: "event404",
        datetime: "event404",
      };
    }

    // checking if user exist
    var user = await db.collection("users").findOne({
      contact_num: args.contact_num,
      user_emailid: args.user_emailid,
    });
    if (!user) {
      // add user
      let newuser = await db.collection("users").insertOne({
        user_name: args.user_name,
        business_name: args.business_name,
        business_type: args.business_type,
        contact_num: args.contact_num,
        user_emailid: args.user_emailid,
        user_address: args.user_address,
        user_city: args.user_city,
      });

      // user added, now it gets registered for the event
      let dt = new Date();

      let resp = await db.collection("event_reg_users").insertOne({
        event_id: mongodb.ObjectID(args.event_id),
        user_id: mongodb.ObjectID(newuser.insertedId),
        datetime: dt,
      });

      return {
        _id: resp.insertedId,
        event_id: args.event_id,
        user_id: newuser.insertedId,
        datetime: dt
      };
    } else {
      // user exist & check if already registered
      let reg = await db.collection("event_reg_users").findOne({
        event_id: mongodb.ObjectID(args.event_id),
        user_id: mongodb.ObjectID(user._id),
      });

      if (!reg) {
        // user is not registered, register the user
        let dt = new Date();
        let resp = await db.collection("event_reg_users").insertOne({
          event_id: mongodb.ObjectID(args.event_id),
          user_id: mongodb.ObjectID(user._id),
          datetime: dt,
        });

        return {
          _id: resp.insertedId,
          event_id: args.event_id,
          user_id: user._id,
          datetime: dt
        };
      } else {
        // user already registered
        return {
          _id: "alreadyREG",
          event_id: "alreadyREG",
          user_id: "alreadyREG",
          datetime: "alreadyREG",
        };
      }
    }
  },
};

module.exports = { EventRegUserType, RegisterUser };
