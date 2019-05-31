const express = require('express');

const app = express();

// fix for formData issue ... sending files
const fileUpload =  require('express-fileupload')

const PORT = process.env.PORT || 8001;

// format inbound data
// use json
app.use(express.json());
// nested obj/arr
app.use(express.urlencoded({extended: true}));

app.use(fileUpload())

// read static files like css
app.use(express.static("./app/public/"));

//routes
require("./app/routing/apiRoutes")(app);
require("./app/routing/htmlRoutes")(app);

app.listen(PORT, () => {
    console.log(`🌎 ==> Server now listening on PORT ${PORT}`)
})