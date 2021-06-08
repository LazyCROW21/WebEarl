const mongodb = require("mongodb");
const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const Contact = new GraphQLObjectType({
  name: "Contacts",
  description: "Contact Table",
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    contact_name: {
        type: GraphQLNonNull(GraphQLString),
    },
    contact_emailid: {
        type: GraphQLNonNull(GraphQLString),
    },
    contact_phoneno: {
        type: GraphQLNonNull(GraphQLString),
    },
    cobtact_message: {
        type: GraphQLNonNull(GraphQLString),
    },
    contact_business_name: {
        type: GraphQLNonNull(GraphQLString),
    },
    contact_business_type: {
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
    return client.db("eventmng").collection("contacts");
}

const ContactType = {
    type: new GraphQLList(Contact),
    description: 'Contact',
    resolve: async () => {
        let contact_col = await loadDataBase();
        return contact_col.find().toArray();
    }
}

module.exports = ContactType;