const mongodb = require("mongodb");
const config = require('../server.config');
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
  const client = await mongodb.MongoClient.connect(config.DB_URL,
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
