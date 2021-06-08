const express = require('express');
// const mongodb = require("mongodb");
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    AdminType, 
    UserType, 
    OtherQuestionType, 
    ContactModel, 
    EventType, 
    EventRegUserType, 
    UserAnswersType
} = require('./models');

const {
    GraphQLSchema,
    GraphQLObjectType
} = require('graphql');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        admins: AdminType,
        users : UserType,
        otherquestions: OtherQuestionType,
        contacts: ContactModel.ContactType,
        events: EventType,
        event_reg_user: EventRegUserType,
        user_answers: UserAnswersType
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        insertContact: ContactModel.insertContact
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
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