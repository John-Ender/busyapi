var redis = require('redis');
var redisUrl = process.env.REDIS_URL;

console.log(redisUrl);
var client = redis.createClient(redisUrl);

var uuid = require('uuid/v1');

module.exports = function (app) {
    app.post('/api/usages', function (req, res) {
        var id = uuid();

        client.set(id, JSON.stringify(req.body), function () {
            res.status(201).json({'id': id});
        });
    });
}
