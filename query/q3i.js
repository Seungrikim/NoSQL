// Task 3i

db.credits.aggregate([
    // TODO: Write your query here
     {$unwind: {path: "$cast"}},
     //{$match: {$eq: ["$cast.id", 7624]}},
     {$match: {"cast.id": 7624}},
     //{$match: {"$cast.id": {$eq: 7624}}},
     {
         $lookup: {
             from: "movies_metadata", // Search inside movies_metadata
             localField: "movieId", // match our _id
             foreignField: "movieId", // with the "movieId" in movies_metadata
             as: "movies" // Put matching rows into the field "movies"
         }
     },
     //{$project: {character: {$cond: {if: {$eq: ["$cast.id", 7624]}, then: "$cast.character", else: ""}}}},
     //{$match: {id: {$eq: 7624}}},
     {
        $project: {
                _id: 0, // explicitly project out this field
                title: {$first: "$movies.title"}, // grab the title of first movie
                release_date: {$first: "$movies.release_date"},
                character: "$cast.character",
                //id: "$cast.id",
                //movieId: "$movieId"
                //{$cond: {if: {$eq: ["$cast.id", 7624]}, then: "$cast.character", else: ""}}
        }
     },
    //{$match: {id: {$eq: 7624}}},
    {$sort: {release_date: -1}},
]);
