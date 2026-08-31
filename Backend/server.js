const app = require('./src/app')

const connectToDb = require('./src/config/database')

require('dotenv').config()

const PORT = process.env.PORT || 3000

connectToDb();

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});

// connectToDb();