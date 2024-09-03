// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

const vlidateDate = (req, res, next) => {
  const parameter = req.params.date,
    nowUnix = Date.now();

  if (!parameter) {
    req.paramType = "NOW";
  }
  else if (!isNaN(parameter) && parameter > 0 && parameter <= nowUnix) {
    req.paramType = "UNIX";
  }
  else if (new Date(parameter) != "Invalid Date") {
    req.paramType = "UTC";
  }
  else {
    req.paramType = "ERROR";
  };
  next();
}

const GenerateResult = (req, res, next) => {
  if (req.paramType == "UNIX") {
    const UTC = new Date(Number(req.params.date)).toGMTString();
    req.resultDate = { unix: Number(req.params.date), utc: UTC };
  }
  else if (req.paramType == "UTC") {
    const UNIX = new Date(req.params.date).getTime();
    req.resultDate = {
      unix: UNIX,
      utc: new Date(req.params.date).toGMTString()
    }
  }
  else if (req.paramType == "NOW") {
    req.resultDate = {
      unix: new Date().getTime(),
      utc: new Date().toGMTString()
    }
  }
  else {
    req.resultDate = { error: "Invalid Date" }

  }
  next();
}

app.get("/api/:date?", vlidateDate, GenerateResult, (req, res) => {
  res.json(req.resultDate);
})

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
