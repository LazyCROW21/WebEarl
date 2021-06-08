const mongodb = require("mongodb");
const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const User = new GraphQLObjectType({
  name: "Users",
  description: "Admin Table",
  fields: () => ({
    _id: {
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
    return client.db("eventmng").collection("users");
}

const UserType = {
    type: new GraphQLList(User),
    description: 'User',
    resolve: async () => {
        let user_col = await loadDataBase();
        return user_col.find().toArray();
    }
}

module.exports = UserType;