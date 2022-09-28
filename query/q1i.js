// Task 1i

db.keywords.aggregate([
    // TODO: Write your query here
   

	{$match: {keywords: {$elemMatch: {$or: [{name: "mickey mouse"}, {name: "marvel comic"}]}}}},
    /*{
        $group: {
            _id: "$movieId", // Group by the field movieId
            //min_rating: {$min: "$rating"}, // Get the min rating for each group
            //max_rating: {$max: "$rating"}, // Get the max rating for each group
            count: {$sum: 1} // Get the count for each group
        }
    },*/
    {$sort: {movieId: 1}},

    {$project: {movieId: 1, _id:0}}
]);