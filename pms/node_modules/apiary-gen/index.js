var request = require('request');
var fs = require('fs');
var exec = require('child_process').exec;
var DocGen = function (config) {
    this.token = config.token;
    this.name = config.api_name;
    this.port = config.port || '8000';
    this.path = './swagger.json'
};
DocGen.prototype.generate = function (callback) {
    var self = this;
    var swagger;
    var execStr;
    console.log(`http://localhost:${self.port}/swagger.json`);
    request.get({
        url: `http://localhost:${self.port}/swagger.json`
    }, (err, body, r) => {
        if (err) {
            return callback({err:'Error trying to get swagger.json'},null);
        }
        swagger = r;
        fs.writeFile('./swagger.json', swagger.toString(), (err) => {
            if (err) {
                return callback({err:'Error while trying to write swagger.json locally'},null);
            }
            execStr = `APIARY_API_KEY=${self.token} apiary publish --api-name=${self.name} --path=${self.path}`;
            exec(execStr, (error, stdout, stderr) => {
                if (error || stderr) {
                    return callback({err:'Error executing apiary command'});
                } else {
                    fs.unlink('./swagger.json', (err) => {
                        if (err) {
                            return callback({err:'Error deleting swagger.json'},null);
                        } else {
                            return callback(null,{Generated:true});
                        }
                    })
                }

            })

        })
    })

};
module.exports = DocGen;