// Task 2ii

db.movies_metadata.aggregate([
    // TODO: Write your query here
    //{$match: {userId: 186}},
    //{$toLow: "tagline"},
    //{$split: ["$tagline", " "]},
    {$project : { tagline : { $toLower: "$tagline"}} },
    {$project : { tagline : { $split: ["$tagline", " "] }} },
    {$unwind: {path: "$tagline"}},
    {$project : { tagline : { $trim: {input: "$tagline",  chars: "."}}}},
    {$project : { tagline : { $trim: {input: "$tagline",  chars: ","}}}},
    {$project : { tagline : { $trim: {input: "$tagline",  chars: "!"}}}},
    {$project : { tagline : { $trim: {input: "$tagline",  chars: "?"}}}},
    //{$project : { tagline : { $trim: {input: "$tagline",  chars: "-"}}}},
    //{$project : { tagline : { $trim: {input: "$tagline",  chars: "+"}}}},
    //{$project : { tagline : { $trim: {input: "$tagline",  chars: "'"}}}},
    {$match: {tagline: {$ne: "the"}}},
    {$match: {tagline: {$ne: "and"}}},
    //{$project : { length : { $strLenCP: "$tagline"}}},
    //{$match: {length: {$gt: 3}}},
    {
        $group: {
          _id: "$tagline",
          //tagline: {$push: {$toLower: "$tagline"}},
          //split: {$split: ["$tagline", " "]}
          count: {$sum: 1}
        }
     },
     //{$match: {_id: {$eq: "love"}}},
     {$sort: {count: -1}},
     {$project : { count: 1, length : { $strLenCP: "$_id" }}},
     {$match: {length: {$gt: 3}}},
     {$limit: 20},
     {
       $project: {
         _id: "$_id",
         count: 1,
       }
     },
]);

/*{$project : { tagline : { $split: ["$tagline", " "] }} },
{$unwind: "$tagline"},
{
    $group: {
      _id: "$tagline",
      //tagline: {$push: {$toLower: "$tagline"}},
      //split: {$split: ["$tagline", " "]}
      count: {$sum: "$tagline"}
    }
 },
 //{$sort: {count: -1}},
 //
 {
    $project: {
            _id: {$trim: {input: {$trim: {input: {$trim: {input: {$trim: {input: {$toLower: "$_id"}, chars: "."}}, chars: ","}}, chars: "!"}}, chars: "?"}},
            //title: {$first: "$movies.title"}, // grab the title of first movie
            //tagline: 1
            //tolower: {$toLower: "$_id"}
    }
 },
 {$sort: {count: -1}}*/
