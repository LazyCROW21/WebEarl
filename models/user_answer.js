const mongodb = require("mongodb");
const config = require('../server.config');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const UserAnswers = new GraphQLObjectType({
  name: "UserAnswers",
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
    },
  }),
});

async function loadDataBase() {
  const client = await mongodb.MongoClient.connect(
    config.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  return client.db("eventmng").collection("user_answers");
}

const UserAnswersType = {
  type: new GraphQLList(UserAnswers),
  description: "User Answers",
  resolve: async () => {
    let user_col = await loadDataBase();
    return user_col.find().toArray();
  },
};

const insertAnswer = {
  type: UserAnswers,
  description: "Insert an answer",
  args: {
    oq_id: {
      type: GraphQLNonNull(GraphQLID),
    },
    user_id: {
      type: GraphQLNonNull(GraphQLID),
    },
    answer: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (parent, args) => {
    // checking if id exist
    const client = await mongodb.MongoClient.connect(
      config.DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    var db = client.db("eventmng");
    var resp = await db.collection("otherquestions").findOne({
      _id: mongodb.ObjectID(args.oq_id)
    });
    if(!resp) {
      return {
        _id: "error",
        oq_id: "error",
        user_id: "error",
        answer: "error"
      };
    }
    resp = await db.collection("users").findOne({
      _id: mongodb.ObjectID(args.user_id)
    });
    if(!resp) {
      return {
        _id: "error",
        oq_id: "error",
        user_id: "error",
        answer: "error"
      };
    }

    // actual inserting
    resp = await db.collection("user_answers").insertOne({
      oq_id: mongodb.ObjectID(args.oq_id),
      user_id: mongodb.ObjectID(args.user_id),
      answer: args.answer
    });
    const result = { ...args, _id: resp.insertedId };
    return result;
  },
};

module.exports = { UserAnswersType, insertAnswer };
