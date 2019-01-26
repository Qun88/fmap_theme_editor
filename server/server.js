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

    console.info(__dirname);

    //每次修改的主题备份位置
    const bakFolder = __dirname + '\\bak';

    let fmapID = req.query.map;
    let themeName = req.query.theme;
    let data = req.body;

    fs.rename('./client/data/theme/' + fmapID + '/' + themeName + '/' + themeName + '.theme', bakFolder + '\\' + Date.now() + '_' + fmapID + '_' + themeName + '.theme', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('创建备份主题文件失败');
        }
        else {
            fs.writeFile('./client/data/theme/' + fmapID + '/' + themeName + '/' + themeName + '.theme', JSON.stringify(data), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('写入主题文件失败');
                }
                console.log(Date.now() + ': ' + 'It\'s saved!');
                res.json({});
            });
        }
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});