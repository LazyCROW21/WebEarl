const mongodb = require("mongodb");
const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const Admin = new GraphQLObjectType({
  name: "Admins",
  description: "Admin Table",
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    admin_username: {
        type: GraphQLNonNull(GraphQLString),
    },
    admin_password: {
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
    return client.db("eventmng").collection("admins");
}

const AdminType = {
    type: new GraphQLList(Admin),
    description: 'Admin',
    resolve: async () => {
        let admin_col = await loadDataBase();
        return admin_col.find().toArray();
    }
}

module.exports = AdminType;