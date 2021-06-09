const mongodb = require("mongodb");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const OtherQuestion = new GraphQLObjectType({
  name: "OtherQuestions",
  description: "OtherQuestion Table",
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    question: {
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
  return client.db("eventmng").collection("otherquestions");
}

const OtherQuestionType = {
  type: new GraphQLList(OtherQuestion),
  description: "OtherQuestion",
  resolve: async () => {
    let OtherQuestion_col = await loadDataBase();
    return OtherQuestion_col.find().toArray();
  },
};

const OtherQuestionInsert = {
  type: OtherQuestion,
  description: "OtherQuestion Insert",
  args: {
    question: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (parent, args) => {
    let OtherQuestion_col = await loadDataBase();
    let resp = await OtherQuestion_col.insertOne(args);
    const result = { ...args, _id: resp.insertedId };
    return result;
  },
};

module.exports = {OtherQuestionType, OtherQuestionInsert};
