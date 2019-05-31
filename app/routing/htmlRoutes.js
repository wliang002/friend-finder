const  path = require("path");

module.exports = (app) => {

    // home
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "/../public/home.html"));
    });

    // quiz
    app.get("/survey", (req, res) => {
        res.sendFile(path.join(__dirname, "/../public/survey.html"));
    });
    
    // catch all
    app.get("*", (req, res, next) => {
        if(req.url.indexOf('/api') == 0) return next();
        if(req.url.indexOf('/assets') == 0) return next();
        if(req.url.indexOf('/css') == 0) return next();
        if(req.url.indexOf('/img') == 0) return next();

        res.sendFile(path.join(__dirname, "/../public/home.html"));
    });
}