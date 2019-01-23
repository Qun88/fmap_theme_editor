var express = require('express');
var fs = require('fs');

var app = express();

//allow custom header and CORS
/* app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
}); */

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('client'))

app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});

app.post('/uploadTheme', function (req, res) {
    let data = req.body;
    //rename theme file

    fs.rename('./client/data/theme/tiexi-full/tiexi-full.theme', './client/data/theme/tiexi-full/' + Date.now() + '_tiexi-full.theme', (err) => {
        if (err) {
            console.log('rename-err');
        }
        else {
            fs.writeFile('./client/data/theme/tiexi-full/tiexi-full.theme', JSON.stringify(data), (err) => {
                if (err) throw err;
                console.log(Date.now() + ': ' + 'It\'s saved!');
                res.json({});
            });
        }
    });

    //create new theme file by data



    //return result

    //res.send('ok');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});