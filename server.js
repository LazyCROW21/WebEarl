const express = require('express');
// const mongodb = require("mongodb");
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    AdminType, UserType, OtherQuestionType, ContactType
} = require('./models');

const {
    GraphQLSchema,
    GraphQLObjectType,
    // GraphQLString,
    GraphQLList
} = require('graphql');

const Admins = [
    {_id: 1, admin_username: "Admin", admin_password: "Admin"},
];

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        admins: AdminType,
        users : UserType,
        otherquestions: OtherQuestionType,
        contacts: ContactType
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
});

const app = express()
const PORT = 5000;

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log("Server Running at Port:" + PORT);
})