# WebEarl-GraphQL-API
Event Management GraphQL APIs

CRUD add users, events, question and answers for event

### Root Types:
query: Query
mutation: Mutation

---

### FIELDS
admins(username: String!password: String!): Admins
Admin

users: [Users]
User

otherquestions: [OtherQuestions]
OtherQuestion

contacts: [Contacts]
Contact

events: [Events]
Event

event_reg_user: [EventRegUser]
Event Registered Users

user_answers: [UserAnswers]
User Answers

---

### Root Mutation

insertContact(
contact_name: String!
contact_emailid: String!
contact_phoneno: String!
contact_message: String!
contact_business_name: String!
contact_business_type: String!
): Contacts
Insert a contact

insertEvent(
e_title: String!
e_sub_title: String!
e_about_title: String!
e_about_text: String!
e_date: String!
e_time: String!
e_venue: String!
e_venue_link: String!
e_speaker_one: String!
e_speaker_two: String
e_speaker_three: String
e_speaker_one_photo: String!
e_speaker_two_photo: String
e_speaker_three_photo: String
e_speaker_one_designation: String!
e_speaker_two_designation: String
e_speaker_three_designation: String
e_staus: String!
template_id: Int!
): Events
Insert an event

updateEvent(
_id: ID!
e_title: String
e_sub_title: String
e_about_title: String
e_about_text: String
e_date: String
e_time: String
e_venue: String
e_venue_link: String
e_speaker_one: String
e_speaker_two: String
e_speaker_three: String
e_speaker_one_photo: String
e_speaker_two_photo: String
e_speaker_three_photo: String
e_speaker_one_designation: String
e_speaker_two_designation: String
e_speaker_three_designation: String
e_staus: String
template_id: Int
): Events
Update an event

otherQuestionInsert(question: String!): OtherQuestions
OtherQuestion Insert

insertAnswer(
oq_id: ID!
user_id: ID!
answer: String!
): UserAnswers
Insert an answer

registerUserEvent(
event_id: ID!
user_name: String!
business_name: String!
business_type: String!
contact_num: String!
user_emailid: String!
user_address: String!
user_city: String!
): EventRegUser
Register a user for the event
