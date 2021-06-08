const mongodb = require("mongodb");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
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
  type: Admin,
  description: "Admin",
  args: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: async (parent, args) => {
    let admin_col = await loadDataBase();
    return admin_col.findOne({admin_username: args.username, admin_password: args.password});
  },
};

module.exports = AdminType;
