// Task 2iii

db.movies_metadata.aggregate([
    // TODO: Write your query here
    //{$project : { tagline : { $trim: {input: "$budget",  chars: "$USD"}}}},
    {$project: {budget: {$cond: { if: { $eq: ["$budget", null] }, then: "unknown", else: "$budget"}}}},
    {$project: {budget: {$cond: { if: { $eq: ["$budget", false] }, then: "unknown", else: "$budget"}}}},
    {$project: {budget: {$cond: { if: { $and: [{ $type: [String] }, {$eq: ["$budget", ""]}] },
    then: "unknown", else: "$budget"}}}},
    //{$project: {budget: {$cond: { if: { $isNumber: [true] },
    //then: {$toString: "$budget"}, else: { $trim: {input: "$budget",  chars: "USD"}} }}}},
    {$project: {budget: {$toString: "$budget"}}},
    {$project : {budget: {$trim: {input: "$budget",  chars: "USD"}}}},
    {$project : {budget: {$trim: {input: "$budget",  chars: " $"}}}},
    {$project : {budget: {$trim: {input: "$budget",  chars: " "}}}},
    {$project: {budget: {$cond: {if: {$eq: ["$budget", "unknown"]}, then: "$budget", else: {$toInt: "$budget"}}}}},
    {$project: {budget: {$cond: {if: {$eq: ["$budget", "unknown"]}, then: "$budget", else: {$round: ["$budget", -7]}}}}},
    {$project: {budget: {$cond: { if: { $eq: ["$budget", null] }, then: "unknown", else: "$budget"}}}},
    {
        $group: {
            _id: "$budget",
            count: {$sum: 1}
        }
     },
    {$project: {"_id": 0, "budget": "$_id" , count: 1}},
    {$sort: {budget: 1}},
]);
/*{$project: {isNumber: {$isNumber: "$budget"}}},
{$project : {"isNumber": 1, budget : {$cond: { if: { $ne: [ "$isNumber", true] },
then: { $trim: {input: "$budget",  chars: $USD}}, else: "$budget"}}}},
  //{ $and: [ { $ne: [ "$qty", 100 ] }, { $lt: [ "$qty", 250 ] } ] },
{$project: {"_id": 0, "budget": 1, "isNumber": 1}}*/
//{$round: ["$_id", -7]}
