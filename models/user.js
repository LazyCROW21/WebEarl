const mongodb = require("mongodb");
const config = require("../server.config");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const QA = new GraphQLObjectType({
  name: "QuestionAnswers",
  description: "For joining question and answers",
  fields: () => ({
    question: { type: GraphQLNonNull(GraphQLString) },
    answer: { type: GraphQLNonNull(GraphQLString) },
  }),
});

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
    },
    QA: {
      type: new GraphQLList(QA),
      resolve: async (user) => {
        const client = await mongodb.MongoClient.connect(config.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let user_answers = client.db("eventmng").collection("user_answers");
        let all_questions = await client.db("eventmng").collection("otherquestions").find().toArray();
        let allanswers = await user_answers.
        find({ user_id: mongodb.ObjectID(user._id) })
        .toArray();
        let result = []
        for(let i=0; i<allanswers.length; ++i) {
            let thequestion = all_questions.find((ques) => {
                // console.log(ques._id.equals(allanswers[i].oq_id));
                if(ques._id.equals(allanswers[i].oq_id)) {
                    return true;
                } else {
                    return false;
                }
            });
            result.push({
                question: thequestion.question,
                answer: allanswers[i].answer,
            });
        }
        return result;
      },
    },
  }),
});

async function loadDataBase() {
  const client = await mongodb.MongoClient.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db("eventmng").collection("users");
}

const UserType = {
  type: new GraphQLList(User),
  description: "User",
  resolve: async () => {
    let user_col = await loadDataBase();
    return user_col.find().toArray();
  },
};

module.exports = UserType;
