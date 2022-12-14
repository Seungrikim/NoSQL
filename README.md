# NoSQL

## Overview

Worked with a subset of the [MovieLens Dataset](https://www.kaggle.com/rounakbanik/the-movies-dataset). The table was not organized in tables of records but rather as collections of documents. Documents are similar to records in the sense that they are used to group together pieces of data, documents can have fields that _are not_ primitive data types. For example, the following document has three fields, two of which aren't primitive data types:

```typescript
{
    "dataA": 1, // a regular primitive data type
    "anArray": [1,2,3], // an array!
    "nestedDocument": {"dataB": 2, "dataC": 3} // a doc inside a doc!
}
```

The following section will introduce you to the dataset.

## Understanding the Dataset

```text
$ mongo movies
MongoDB shell version v4.4.1
connecting to: mongodb://127.0.0.1:27017/movies?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("cd49cd34-6c93-4548-aa20-b57e9f45d975") }
MongoDB server version: 4.4.1

> db.ratings.findOne()
{
    "_id" : ObjectId("5fb32f37766efe011e6af587"),
    "userId" : 1,
    "movieId" : 783,
    "rating" : 2,
    "timestamp" : 1260759148
}
```

### Movies Metadata

The `movies_metadata` collection contains documents with metadata for every movie in the MovieLens Dataset:

* `movieId (int)`: A unique identifier for the movie. Corresponds to the field of the same name in `keywords`, `ratings`, and `credits`.
* `title (string)`: The title of the movie.
* `overview (string)`: A summary of the movie.
* `tagline (string)`: A short phrase usually used to advertise the movie.
* `release_date (int)`: The date of the film's release, as a UNIX Timestamp.
* `budget (inconsistent)`: The movie's production budget in USD. See question 2iii for more details on this field's type.
* `vote_average (number)`: The average rating given by viewers on a scale from 0 to 10.
* `vote_count (int)`: The total number of ratings given.
* `revenue (int)`: The movie's revenue in USD
* `runtime (int)`: The length of the movie in minutes
* `genres (array)`: 0 or more documents each containing the following:
  * `name (string)`: the name of one of the movie's genres
  * `id (int)`: a unique identifier for the genre

Example document:

```typescript
// Extra fields omitted for brevity
{
    "budget" : 30000000,
    "genres" : [
        { "id" : 16, "name" : "Animation" },
        { "id" : 35, "name" : "Comedy" },
        { "id" : 10751, "name" : "Family" }
    ],
    "overview" : "Led by Woody, Andy's toys live happily...",
    "release_date" : 815040000,
    "revenue" : 373554033,
    "runtime" : 81,
    "status" : "Released",
    "title" : "Toy Story",
    "vote_average" : 7.7,
    "vote_count" : 5415,
    "movieId" : 862,
    "tagline" : ""
}
```

### Keywords

The `keywords` collection contains documents with keywords related to certain movies. Each document in the collection has the following attributes:

* `movieId (int)`: A unique identifier for the movie. Corresponds to the field of the same name in `movies_metadata`, `ratings`, and `credits`
* `keywords (array)`: 0 or more documents each containing the following:
  * `id (int)`: A unique identifier for a keyword
  * `name (string)`: A keyword associated with the movie, for example "based on novel", "pirate", and "murder".

Example document:

```typescript
{
    "keywords" : [
        { "id" : 3633, "name" : "dracula" },
        { "id" : 11931, "name" : "spoof" }
    ],
    "movieId" : 12110
}
```

### Ratings

The `ratings` collection contains roughly 10,000 ratings submitted by specific viewers. Each document consists of the following format:

* `userId (int)`: A unique identifier for the user who gave the rating
* `movieId (int)`: A unique identifier for the movie. Corresponds to the field of the same name in `movies_metadata`, `keywords`, and `credits`
* `rating (number)`: The rating the user gave the movie, from 0 to 5.
* `timestamp (int)`: UNIX timestamp of when this rating was given

```typescript
{
    "userId" : 1,
    "movieId" : 9909,
    "rating" : 2.5,
    "timestamp" : 1260759144
}
```

### Credits

The `credits` collection contains details on writers, actors, directors, and technicians who worked on the production of the movies in the data set. Each document consists of the following:\`

* `movieId (int)`: A unique identifier for the movie. Corresponds to the field of the same name in `movies_metadata`, `keywords`, and `ratings`
* `cast (array)`: 0 or more documents of the each containing the following fields:
  * `id (int)`: A unique identifier for the actor who played the character
  * `character (string)`: The name of the character in the movie
  * `name (string)`: The name of the actor as listed in the movie's credits
* `crew (array)`: 0 or more documents each containing the following fields:
  * `id (int)`: A unique identifier for the crew member
  * `department (string)`: The department the crew member worked in
  * `job (string)`: The job title of the crew member \(e.g. "Audio Technician", "Director"\)
  * `name (string)`: The name of the crew member as listed in the movie's credits

Example document:

```typescript
// Extra fields for cast and crew omitted for brevity
{
    "cast" : [
        {
            "character" : "Max Goldman",
            "id" : 6837,
            "name" : "Walter Matthau"
        },
        ... // Other cast members
    ],
    "crew" : [
        {
            "department" : "Directing",
            "id" : 26502,
            "job" : "Director",
            "name" : "Howard Deutch",
        },
        ... // Other crew members
    ],
    "movieId" : 15602
}
```

Lets break down the query.

* `db.ratings.aggregate([ ... ])` : This tells mongo that we'll be running an "aggregate" operation. We can pass in a list `[ ... ]` known as the "pipeline", which will execute a series of operations. Each operation in the pipeline is known as a "stage", and each stage operates on the output of the previous stage.
* `{$match: ...}` : This is the only element of the pipeline so far. This tells mongo that we want documents from the collection that match certain properties, much like a `WHERE` clause. 
* `{timestamp: { $gte: ..., $lt: ...}}` : This tells mongo that we only want documents where the timestamp field has a value greater than or equal to `838857600` and less than `849398400`.
* `838857600` and `849398400`: The value in the `timestamp` field is the number of seconds that have elapsed since January 1, 1970. This is more commonly known as "Unix time", "POSIX time", "Epoch time" or "UNIX Timestamp" and is a common way to represent times in computer systems. The two timestamps we use in the query correspond to October 1st, 1996 and December 1st, 1996 respectively. 
  * There's no shortage of online tools like [this one ](https://www.epochconverter.com/)to convert between human readable times and UNIX time.
  * If you've ever heard of rumors about the world ending in January, 2038, that has to do with the way these timestamps are stored! 

### Task 1: Basics

**i.** After spending over half a year social distancing you find yourself thinking a lot about two things: time travel and presidential elections. Find the IDs of all movies labeled with the keyword "time travel" **or** "presidential election" by writing a query on the `keywords` collection. Order your output in ascending order of `movieId`. The output documents should have the following fields:

```typescript
{"movieId": <number>}
```

```typescript
db.movies_metadata.aggregate([
  // Use elemMatch in the $match stage to find movies  with English 
  // as a spoken language
    {$match: {spoken_languages: {$elemMatch: {name: "English"}}}},
    {$project: {title: 1, _id: 0}} // clean up output
])
```

**ii.** We're interested in the best comedy films to watch. Return the id, title, average vote, and vote count of the top 50 comedy movies ordered from highest to lowest by average vote, breaking ties by descending order of vote count, and any further ties in ascending order of `movieId`. Only include movies with 50 or more votes. The output documents should have the following fields:

```typescript
{
    "title" : <string>, 
    "vote_average" : <number>, 
    "vote_count" : <number>, 
    "movieId" : <number>
}
```

* Useful operators: [$elemMatch](https://docs.mongodb.com/manual/reference/operator/aggregation/or/), [$gte](https://docs.mongodb.com/manual/reference/operator/aggregation/gte/) for matching
* Hint: genre names are case sensitive!

**iii.** Do movies get more good reviews than bad reviews? Is it the other way around? We want to know! For each possible rating find how many times that rating was given. Include the rating and the number of the times the rating was given and output in descending order of the rating. The output documents should have the following fields:

```typescript
{
    "count": <number>,
    "rating": <number>
}
```

**iv.** You've discovered a critic who always seems to know exactly which movies you would love and which ones you would hate. Their true name is a mystery, but you know their user id: `186`. Find critic 186's five most recent movie reviews, and create create a document with the following fields:

```typescript
{
    "movieIds": [most recent movieId, 2nd most recent, ... , 5th most recent],
    "ratings": [most recent rating, 2nd most recent, ..., 5th most recent],
    "timestamps": [most recent timestamp, 2nd most recent, ... , 5th most recent]
}
```

* Useful operators: Look into the [$push](https://docs.mongodb.com/manual/reference/operator/aggregation/push/) operator

### Task 2: Movie Night

**i.** The TAs are having a movie night but they're having trouble choosing a movie! Luckily, Joe has read about IMDb's Weighted Rating which assigns movies a score based on demographic filtering. The weighted ranking \($$\textrm{WR}$$\) is calculated as follows:

$$\textrm{WR} = (\frac{v}{v+m})R + (\frac{m}{v+m})C$$

* $$v$$ is the number of votes for the movie
* $$m$$ is the minimum votes required to be listed in the chart
* $$R$$ is the average rating of the movie \(this is stored in the field `vote_average`\)
* $$C$$ is the mean vote across the whole report. For the purposes of this question this value is approximately 7, which you can hardcode into your query.

We would like to set a minimum number of votes to make sure the score is accurate. For this question we will assume the minimum votes required to be listed is 1838. Return the 20 highest rated movies according to this formula. The output should contain two fields: `title` with the title of the movie and `score` which contains the WR for the associated movie rounded to two decimal places. How many movies can you recognize on this list? Sort in descending order of `score`, and break ties in descending order of `vote_count` and ascending order of `title`. Your output documents should have the following fields:

```typescript
{
    "title": <string>,
    "vote_count": <number>,
    "score": <number>
}
```

* Useful operators: Look up what the [`$add`](https://docs.mongodb.com/manual/reference/operator/aggregation/add/), [`$multiply`](https://docs.mongodb.com/manual/reference/operator/aggregation/multiply/), [`$divide`](https://docs.mongodb.com/manual/reference/operator/aggregation/divide/) , and [`$round`](https://docs.mongodb.com/manual/reference/operator/aggregation/round/) operators do \(you may find this question reminiscent of Scheme from 61a!\)
* **Expected output note**: If you got your copy of the skeleton code before 11/18/20, your expected output may be out of date. You can update your expected out in your copy of the skeleton by copying and pasting the contents of [this file](https://github.com/berkeley-cs186/fa20-proj6/blob/master/expected_output/q2i.dat) into `expected_output/q2i.dat`

**ii.** The TAs consider the prospect of making their own feature film on the beauty and joy of databases, and want to think of a catchy tagline. Run the following to see some examples taglines:

`db.movies_metadata.aggregate({$project: {"_id": 0, "tagline": 1}})`

Notice how the second one is "Roll the dice and unleash the excitement!" We want to see the 20 most common words \(length &gt; 3\) across all taglines in descending order. In order to do this, we would need to split our sample tagline into its constituent words \("Roll", "the", "dice", "and", "unleash", "the", "excitement!"\).

To make things interesting, we will limit the words to length &gt;3 to remove filler words, prepositions, and some pronouns \(in the previous example, remove "the" and "and"\). We also want to trim off any surrounding punctuation \(periods, commas, question marks, or exclamation points\) in a word and set all words to lowercase \(our final set of words that will be included in our table for our example tagline is "roll, "dice", "unleash", "excitement", without the exclamation mark\). Order your output by descending order of `count`. Your output documents should have the following fields:

```typescript
{
    "_id": <string>,
    "count": <number>
}
```

Can you guess what the most popular words might be?

* Useful operators:
  * [$split](https://docs.mongodb.com/manual/reference/operator/aggregation/split/) can be used to convert a string to an array. For example splitting the string "a proper copper coffee pot" by " " \(a space\) will create the array \["a", "proper", "copper", "coffee", "pot"\]
  * [$toLower](https://docs.mongodb.com/manual/reference/operator/aggregation/toLower/) converts a string to lowercase
  * [$trim](https://docs.mongodb.com/manual/reference/operator/aggregation/trim/) can be used to trim off surrounding punctuation marks
  * [$strLenCP](https://docs.mongodb.com/manual/reference/operator/aggregation/strLenCP/) can be used to get the length of a string. Make sure to check for length _after_ removing punctuation marks!

**iii.** How much does it cost to make a movie? The TAs were hoping to write a query for this but realized something that will haunt them for the rest of their lives... Mongo's lack of schema requirements means that the budget field of documents metadata isn't always an integer! Even worse, sometimes the field doesn't even exist! It looks like whoever prepared the data set always did one of the following:

* If they didn't know the budget of a given movie they did one of the following:
  * Set the `budget` field to `false`
  * Set the `budget` field to `null`
  * Set the `budget` field to an empty string: `""`
  * Excluded the `budget` field from the document
* If they did know the budget of a given movie they did the following:
  * Set the `budget` field to a number value, for example `186`
  * Set the `budget` field to a string with prefix `$`, for example `"$186"`
  * Set the `budget` field to a string with the the postfix "[USD](https://en.wikipedia.org/wiki/USD)", for example `"186 USD"`

Group the budgets by their value rounded to the nearest multiple of ten million, and return the count for each rounded value. Additionally include an extra group `"unknown"` for the count of movies where the budget was not known. Order by ascending order of rounded budget. Your output documents should have the following fields:

```typescript
{
    "budget": <number or "unknown">,
    "count": <number>
}
```

* Useful operators: You may find the following useful: [$ne](https://docs.mongodb.com/manual/reference/operator/aggregation/ne/), [$and](https://docs.mongodb.com/manual/reference/operator/aggregation/and/), [$cond](https://docs.mongodb.com/manual/reference/operator/aggregation/cond/), [$isNumber](https://docs.mongodb.com/manual/reference/operator/aggregation/isNumber/), [$toInt](https://docs.mongodb.com/manual/reference/operator/aggregation/toInt/) and [$round](https://docs.mongodb.com/manual/reference/operator/aggregation/round/). Trim will also be useful here for removing prefixes and postfixes.
* Hint: You can check if a field is present in a document by checking whether the field is equal to `undefined`

### Task 3: Paparazzi

**i.** Comic book writer [Stan Lee](https://en.wikipedia.org/wiki/Stan_Lee) was known to make cameos in film adaptations of his works. Find the release date, title, and the name of the character Lee played for every movie Lee has appeared in. Order the results in descending order of release date. Your output documents should have the following fields:

```typescript
{
    "title": <string>,
    "release_date": <number>,
    "character": <string>
}
```

* Useful operators: you may find [$unwind](https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/) \(used in 2ii\) handy here

**ii.** Director [Wes Anderson](https://en.wikipedia.org/wiki/Wes_Anderson) is known for his unique visual and narrative style, and frequently collaborates with certain actors. Find the 5 actors who have appeared the most often in movies where Anderson is listed on the crew with the title "Director". Your output should include the actor's name, id, and the number of times the actor has collaborated with Anderson. Order in descending order of the number of collaborations. Break ties in ascending order of the actor's id. Your output documents should have the following fields:

```typescript
{
    "count": <number>, // number of times collaborated
    "id": <string>,
    "name": <string>
}
```
