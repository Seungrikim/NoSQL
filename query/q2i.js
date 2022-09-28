// Task 2i

db.movies_metadata.aggregate([
    // TODO: Write your query her
    // Perform an aggregation
    {
        $group: {
            _id: "$movieId", // Group by the field movieId
            //min_rating: {$min: "$vote_count"}, // Get the min rating for each group
            //{$multiply: ["$vote_averag" ,{$divide: ["$vote_count", {$add: [ "$vote_count", {$min: "$rating"}]}]}]},
            vote_count: {$sum: "$vote_count"},
            vote_average: {$first: "$vote_average"},
            title: {$first: "$title"}
            //score: {$add: {"$vote_count", "$min_rating"}}
             // Get the max rating for each group
           // Get the count for each group

        }
     },
     // Sort in descending order of count, break ties by ascending order of _id
     // Perform a "lookup" on a different collection
     {
        $project: {
                _id: 0, // explicitly project out this field
                 // grab the title of first movie
                title: 1,
                vote_count: 1, // rename count to num_ratings
                //min_rating: 1,
                //vote_average: 1,
                //min_rating: {$min: "$vote_count"},
                score: {$round: [{$add: [{$multiply: ["$vote_average" ,{$divide: ["$vote_count", {$add: [ "$vote_count", 1838]}]}]},
                {$multiply: [7 ,{$divide: [1838, {$add: [ "$vote_count", 1838]}]}]}]}, 2]}
        }
     },
     {$sort: {score: -1, vote_count: -1, title: 1}},
     // Limit to only the first 10 documents
     {$limit: 20}
]);
