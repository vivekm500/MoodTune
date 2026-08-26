userSchema.pre("save", function(next){})
userSchema.post("save", function(doc, next){})

This is a Mongoose middleware (hook). It means:
"Before a document is saved to MongoDB, run this function."

userSchema.pre("save", function(next) {
    // code here
});

Let's break it down.
userSchema.pre()
pre() means before.
So:
userSchema.pre("save", ...)
means:
Before Mongoose performs the save operation, execute this function.

The flow is:
User data
   ↓
user.save()
   ↓
pre("save") middleware  ← your code runs here
   ↓
next()
   ↓
MongoDB save

"save"
This tells Mongoose which operation you're hooking into.
pre("save", ...)
means before .save().

For example:
const user = new User({
    name: "Rahul",
    password: "123456"
});

await user.save();
Before that user actually gets saved, your pre("save") function runs.
function(next)
The next function tells Mongoose:
"I'm finished with my middleware. You can continue."

For example:
userSchema.pre("save", function(next) {

    console.log("Before saving");

    next();
});
If you don't call next(), Mongoose generally waits for this middleware to finish and the save won't proceed.
Why is this commonly used?
The most common example is hashing passwords.
You don't want to store:
password: "mypassword123"
directly in MongoDB.
You can hash it before saving:
userSchema.pre("save", async function(next) {

    this.password = await bcrypt.hash(this.password, 10);

    next();
});
Then:
User enters:
mypassword123

       ↓

pre("save")

       ↓

bcrypt hash

       ↓

$2b$10$....

       ↓

MongoDB
What's this here?
This is very important.
With:
function(next) {
    console.log(this);
}
this refers to the document being saved.
So:
this.password
means:
the password field of the current user document.

For example:
const user = new User({
    name: "Rahul",
    password: "hello123"
});

await user.save();
Inside the hook:
this.name
// "Rahul"

this.password
// "hello123"
Then you can modify it before MongoDB gets it.
Why function instead of arrow function?
You'll often see:
userSchema.pre("save", function(next) {
    console.log(this);
});
rather than:
userSchema.pre("save", (next) => {
    console.log(this);
});
Because Mongoose uses this to give you the current document.
Arrow functions don't have their own this, so using an arrow function here can cause problems.
Remember this pattern:
schema.pre("save", function(next) {
    // `this` = current document
    // do something
    next();
});
So the three pieces are:
- pre → do something before
- "save" → before saving the document
- next() → middleware is done, continue saving.


explain userSchema.post("save", function(next){})


Yes. The key difference from pre("save") is simply when it runs.
userSchema.post("save", function(next) {
    // code here
});
means:
"After the user has been successfully saved, run this function."

Compare pre vs post
user.save()
    │
    ▼
pre("save")       ← BEFORE saving
    │
    ▼
MongoDB save
    │
    ▼
post("save")      ← AFTER saving
So:
pre("save")
userSchema.pre("save", function(next) {
    // BEFORE MongoDB saves the user
    next();
});
Common use:
- Hash password
- Modify fields
- Validate/prepare data
- Generate something before saving
Example:
userSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
post("save")
userSchema.post("save", function(doc, next) {
    // AFTER MongoDB successfully saves the user
    next();
});
Common use:
- Logging
- Sending notifications
- Triggering some follow-up action
- Doing something that depends on the document already being saved
For example:
userSchema.post("save", function(doc, next) {
    console.log("User saved:", doc.email);
    next();
});
Here doc is the saved user document.
One important correction about your code
You wrote:
userSchema.post("save", function(next) {
Be careful here.
For post("save"), Mongoose commonly gives you the saved document as the first argument:
userSchema.post("save", function(doc, next) {
    console.log(doc);
    next();
});
So don't blindly think:
function(next)
always means next is the first argument. Middleware signatures depend on the particular Mongoose hook.
Easy way to remember
PRE
 ↓
"Something needs to happen BEFORE saving"

POST
 ↓
"Something needs to happen AFTER saving"
And the most important conceptual difference:
pre("save")
is useful when you want to change/prepare the document before it reaches MongoDB.
post("save")
is useful when the save has already happened and you want to react to that event.


**REDIS**

why we need redish when wee already have databse like mongodb

Because MongoDB and Redis solve different problems.
Think of it like this:
- MongoDB = your permanent storage
- Redis = extremely fast temporary storage / coordination layer
You can build an application using only MongoDB. Redis isn't mandatory. You add Redis when repeatedly hitting MongoDB becomes too slow, expensive, or awkward.
Simple example
Suppose you have an e-commerce app.
MongoDB contains:
User
  id: 123
  name: Rahul
  plan: premium
Every time Rahul opens the website, your backend might need to check his user data.
Without Redis:
Browser
   ↓
Backend
   ↓
MongoDB
   ↓
Response
If 100,000 requests repeatedly ask for the same user/config/product data, MongoDB has to handle all those reads.
With Redis:
Browser
   ↓
Backend
   ↓
Redis ──→ data found? → return immediately
   │
   └── miss → MongoDB → put result in Redis
Now most repeated requests never reach MongoDB.
Why Redis is so fast
Redis primarily keeps data in RAM (memory).
RAM is dramatically faster than going through a database's normal disk/storage path.
For example, you might have:
MongoDB:
"Give me product 123"

        ↓
     database
        ↓
   storage/indexes
        ↓
      result
Redis:
GET product:123
        ↓
      RAM
        ↓
     result
That's why Redis is commonly used for very high-frequency, low-latency operations.
But Redis isn't just a cache
This is where people often misunderstand Redis.
1. Caching
Probably the most common use.
Redis:
product:123 → {name: "iPhone", price: 999}
Your application can avoid querying MongoDB repeatedly.
2. Sessions
Instead of storing session information in your application server:
session:abc123 → user_id: 42
Redis is very convenient for this because sessions are frequently read and often expire.
3. Rate limiting
Suppose you allow:
100 API requests per minute per user.

Redis is excellent for counting:
rate:user:123 → 87
with expiration.
Doing this directly in MongoDB is possible, but Redis is generally much better suited for this type of high-frequency counter.
4. Queues / background jobs
Imagine users upload videos.
You don't want:
Upload
 ↓
Process video for 2 minutes
 ↓
Finally respond
Instead:
User
 ↓
Backend
 ↓
Redis queue
 ↓
"Process video #9281"
 ↓
Worker
 ↓
Video processing
The user gets a quick response while workers process jobs asynchronously.
5. Real-time features
Redis is useful for things like:
- online user presence
- leaderboards
- counters
- pub/sub
- notifications
- distributed locks
- real-time coordination
MongoDB can do some of these things, but Redis has data structures and operations specifically suited to them.
So why not just use MongoDB?
You can.
And this is important:
Don't add Redis just because "real applications use Redis."

That's cargo-cult architecture.
For a small application:
Frontend
   ↓
Backend
   ↓
MongoDB
is often completely fine.
Adding Redis gives you another system to:
- deploy
- monitor
- secure
- back up/configure
- debug
- keep synchronized with MongoDB
That's additional complexity.
The key difference
MongoDB	Redis
Primary database	Usually supporting system
Persistent storage	Often temporary/in-memory
Complex documents/queries	Extremely fast simple operations
Designed to retain your data	Often data can expire/disappear
Large durable datasets	Fast-access working data
Source of truth	Usually not the source of truth
Queries/indexes	Key-value + rich data structures
Good for application data	Good for cache, queues, counters, sessions, etc.


A useful mental model
Imagine a library.
MongoDB is the library's storage room.
It contains the books permanently.
Redis is the librarian's desk.
The librarian keeps the books people ask for most often right on the desk so they don't have to walk into the storage room every time.
You don't replace the library with the desk.
You use the desk to make frequently needed things faster.
One more important point
Redis doesn't automatically make your application faster.
If you have:
10 users
100 database reads/day
Redis probably adds unnecessary complexity.
If you have:
1,000,000 users
millions of repeated reads
high traffic
real-time counters
sessions
queues
rate limiting
then Redis can become extremely useful.
So the real question isn't "MongoDB or Redis?"
It's usually:
"What data should be permanently stored in MongoDB, and what data/operations benefit from Redis's speed and data structures?"

If you want, I can also explain MongoDB + Redis architecture with a real Node.js example, including exactly what gets stored in each and when Redis reads/writes happen.


if redish is that fast so why not we use it as our primary database


You actually can use Redis as a primary database. The problem is that "fast" isn't the only requirement for a database.
The key distinction is:
Redis optimizes for speed; MongoDB optimizes for durable, flexible storage.

The biggest issue: durability
Imagine your application's entire user database is in Redis:
Redis
├── users
├── orders
├── payments
├── products
└── everything else
Redis primarily operates in memory. It has persistence mechanisms, but its architecture is fundamentally designed around memory-first operation.
Now imagine:
💥 Server crashes
💥 Power failure
💥 Memory is lost
If your persistence/recovery setup isn't appropriate, you can lose data.
That's a very different risk profile from a database designed primarily around durable storage.
Think about an order
Suppose a customer buys something:
Order #9281
User: 123
Product: Laptop
Amount: ₹80,000
Payment: SUCCESS
You really don't want:
"Oops, Redis restarted and that order disappeared."

For critical business data, you want strong durability, transactions, recovery, backups, replication, indexes, querying, etc.
Redis is also not designed for MongoDB-style querying
Suppose you ask:
Find all customers in Bihar who spent more than ₹50,000 this year, ordered by total spending.

MongoDB is designed around document storage, indexes, and querying.
Redis is primarily built around data structures such as:
key → value
key → hash
key → list
key → set
key → sorted set
Redis can do sophisticated things, especially with modules/features, but you're moving away from its core strength.
Here's the architectural difference
A common production architecture looks like:
                 ┌─────────────┐
                 │   Backend   │
                 └──────┬──────┘
                        │
              ┌─────────┴─────────┐
              ↓                   ↓
          ┌────────┐          ┌─────────┐
          │ Redis  │          │ MongoDB │
          └────────┘          └─────────┘
             │                    │
          FAST                    │
       temporary                 DURABLE
          data                    data
MongoDB might contain:
users
orders
products
payments
addresses
Redis might contain:
cache
sessions
rate limits
temporary tokens
queues
counters
leaderboards
But here's the interesting part
If your application needs insanely fast access and your data is relatively simple, Redis can absolutely be the primary database.
For example, imagine a real-time leaderboard:
player:123 → 98,500 points
player:456 → 97,200 points
player:789 → 96,800 points
Redis sorted sets are fantastic for this.
You don't necessarily need MongoDB for that data.
Likewise, Redis can persist data to disk and supports replication and other durability features. So saying "Redis cannot be a database" is simply wrong.
The better statement is:
Redis can be a primary database, but it isn't the best primary database for every kind of application.

The deeper lesson
Don't choose databases based on:
"Which one is faster?"

That's the wrong question.
Choose based on:
What guarantees and operations does my application need?
For example:
Requirement	Better fit
Permanent business data	MongoDB
Complex document queries	MongoDB
Large durable dataset	MongoDB
Extremely fast cache	Redis
Session storage	Redis
Rate limiting	Redis
Counters	Redis
Leaderboards	Redis
Job queues	Redis
Pub/Sub	Redis
Temporary data	Redis


And there's nothing stopping you from using both.
A good mental model
MongoDB = the vault
Redis = the workbench
You don't keep your company's permanent records on the workbench just because you can reach them faster.
You keep frequently needed things there while the vault remains the source of truth.
And one correction to the common explanation: Redis isn't inherently "faster than MongoDB" for every operation. Redis is exceptionally fast for the workloads it's designed for; MongoDB can also be very fast with appropriate indexes, schema design, hardware, and query patterns.



// Redis publis endpoint

distinctive-snails-quince-74033.db.redis.io:15495

HOST - distinctive-snails-quince-74033.db.redis.io:
PORT - 15495
PASSWORD - oWLh1CP01KgrofRJqgiey4PJlIYyfSuy

to connecct database with redis we need to install a package in backend with command **npm i ioredis**

// follow this link to read about how to setup redis and use it
**https://www.npmjs.com/package/ioredis**