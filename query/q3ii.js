// Task 3ii

db.credits.aggregate([
    // TODO: Write your query here
    //{$unwind: {path: "$crew"}},
    {$match: {crew: {$elemMatch: {name: "Wes Anderson", job: "Director"}}}},
    //{$match: {crew: {$elemMatch: {job: "Director"}}}},
    //{$match: {"crew.id": 5655}},
    {$group: {_id: {val1: "$cast.name", val2: "$crew.name"}, count: {$sum: 1}}},

    /*{
        $lookup: {
            from: "movies_metadata", // Search inside movies_metadata
            localField: "movieId", // match our _id
            foreignField: "movieId", // with the "movieId" in movies_metadata
            as: "movies" // Put matching rows into the field "movies"
        }
    },*/
    {
       $project: {
               _id: 0, // explicitly project out this field
               //title: {$first: "$movies.title"}, // grab the title of first movie
               //release_date: {$first: "$movies.release_date"},
               count: 1,
               name: "_id",
               id: "$val1"
               //cast_name: "$cast.name"
               //id: "$cast.id",
               //movieId: "$movieId"
               //{$cond: {if: {$eq: ["$cast.id", 7624]}, then: "$cast.character", else: ""}}
       }
    },

    {$sort: {count: -1}},
]);
