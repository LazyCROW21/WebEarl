const mongodb = require("mongodb");
const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const UserAnswers = new GraphQLObjectType({
  name: "User Answers",
  description: "User Answers Schema",
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    oq_id: {
        type: GraphQLNonNull(GraphQLID),
    },
    user_id: {
        type: GraphQLNonNull(GraphQLID),
    },
    answer: {
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
    return client.db("eventmng").collection("user_answers");
}

const UserType = {
    type: new GraphQLList(UserAnswers),
    description: 'User Answers',
    resolve: async () => {
        let user_col = await loadDataBase();
        return user_col.find().toArray();
    }
}

module.exports = UserType;