var express = require('express');
var app = express();
var ytdl = require('ytdl-core');

app.listen('3000', function(){
    console.log("Listening on 3000");
});

app.get('/download', function(req, res) {
    var link = req.query.url;
    var format = req.query.format;
    var quality = req.query.quality;
    var filename = req.query.filename;

    if (!link || !format || !quality || !filename) {
        return res.status(400).send('Missing required query parameters');
    }

    try {
        res.header('Content-Disposition', `attachment; filename="${filename}.${format}"`);

        const video = ytdl(link, {
            format: format,
            quality: quality,
        });

        video.pipe(res);
        video.on('error', (err) => {
            console.error(err);
            res.status(500).send('Error downloading video');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
