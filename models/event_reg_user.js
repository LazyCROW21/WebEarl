const mongodb = require("mongodb");
const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
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
    }
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
    description: 'Event Registered Users',
    resolve: async () => {
        let event_reg_user_col = await loadDataBase();
        return event_reg_user_col.find().toArray();
    }
}

module.exports = EventRegUserType;