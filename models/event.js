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
    e_status: {
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
    return event_col.find({ e_status: "active" }).toArray();
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
    e_status: {
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

const UpdateEvent = {
  type: Event,
  description: "Update an event",
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) },
    e_title: {
      type: GraphQLString,
    },
    e_sub_title: {
      type: GraphQLString,
    },
    e_about_title: {
      type: GraphQLString,
    },
    e_about_text: {
      type: GraphQLString,
    },
    // Date & Time can of int(timestamp) combined together OR
    // Date can be String(DD-MM-YYYY)
    e_date: {
      type: GraphQLString,
    },
    // Time can be String(hh:mm p)
    e_time: {
      type: GraphQLString,
    },
    e_venue: {
      type: GraphQLString,
    },
    e_venue_link: {
      type: GraphQLString,
    },
    e_speaker_one: {
      type: GraphQLString,
    },
    e_speaker_two: {
      type: GraphQLString,
    },
    e_speaker_three: {
      type: GraphQLString,
    },
    e_speaker_one_photo: {
      type: GraphQLString,
    },
    e_speaker_two_photo: {
      type: GraphQLString,
    },
    e_speaker_three_photo: {
      type: GraphQLString,
    },
    e_speaker_one_designation: {
      type: GraphQLString,
    },
    e_speaker_two_designation: {
      type: GraphQLString,
    },
    e_speaker_three_designation: {
      type: GraphQLString,
    },
    e_status: {
      type: GraphQLString,
    },
    template_id: {
      type: GraphQLInt,
    },
  },  
  resolve: async (parent, args) => {
    let event_col = await loadDataBase();
    let data = args;
    var query = { _id: mongodb.ObjectID(args._id) };
    delete data._id;
    let update = { $set: data};
    let resp = await event_col.updateOne(query, update);
    // const result = { ...args, _id: resp.insertedId };
    // console.log(resp);
    return event_col.findOne(query);
  },
};

module.exports = { EventType, InsertEvent, UpdateEvent };
