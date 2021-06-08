const mongodb = require("mongodb");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const Event = new GraphQLObjectType({
  name: "Events",
  description: "Event Table",
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    e_title: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_sub_title: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_about_title: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_about_text: {
      type: GraphQLNonNull(GraphQLString),
    },
    // Date & Time can of int(timestamp) combined together OR
    // Date can be String(DD-MM-YYYY)
    e_date: {
      type: GraphQLNonNull(GraphQLString),
    },
    // Time can be String(hh:mm p)
    e_time: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_venue: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_venue_link: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_one: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_two: {
      type: GraphQLString,
    },
    e_speaker_three: {
      type: GraphQLString,
    },
    e_speaker_one_photo: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_two_photo: {
      type: GraphQLString,
    },
    e_speaker_three_photo: {
      type: GraphQLString,
    },
    e_speaker_one_designation: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_two_designation: {
      type: GraphQLString,
    },
    e_speaker_three_designation: {
      type: GraphQLString,
    },
    e_staus: {
      type: GraphQLNonNull(GraphQLString),
    },
    template_id: {
      type: GraphQLNonNull(GraphQLInt),
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
  return client.db("eventmng").collection("events");
}

const EventType = {
  type: new GraphQLList(Event),
  description: "Event",
  resolve: async () => {
    let event_col = await loadDataBase();
    return event_col.find().toArray();
  },
};

const InsertEvent = {
  type: Event,
  description: "Insert an event",
  args: {
    e_title: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_sub_title: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_about_title: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_about_text: {
      type: GraphQLNonNull(GraphQLString),
    },
    // Date & Time can of int(timestamp) combined together OR
    // Date can be String(DD-MM-YYYY)
    e_date: {
      type: GraphQLNonNull(GraphQLString),
    },
    // Time can be String(hh:mm p)
    e_time: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_venue: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_venue_link: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_one: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_two: {
      type: GraphQLString,
    },
    e_speaker_three: {
      type: GraphQLString,
    },
    e_speaker_one_photo: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_two_photo: {
      type: GraphQLString,
    },
    e_speaker_three_photo: {
      type: GraphQLString,
    },
    e_speaker_one_designation: {
      type: GraphQLNonNull(GraphQLString),
    },
    e_speaker_two_designation: {
      type: GraphQLString,
    },
    e_speaker_three_designation: {
      type: GraphQLString,
    },
    e_staus: {
      type: GraphQLNonNull(GraphQLString),
    },
    template_id: {
      type: GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (parent, args) => {
    let event_col = await loadDataBase();
    let resp = await event_col.insertOne(args);
    const result = { ...args, _id: resp.insertedId };
    return result;
  },
};

module.exports = {EventType, InsertEvent};
