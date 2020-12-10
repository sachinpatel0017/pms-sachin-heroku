var nestcheck = require('nestcheck');
var fs = require('fs');
var pack = require('../../package.json');
var apiaryGen = require('apiary-gen');
var exec = require('child_process').exec;
var builder = function (config) {
    this.token = nestcheck.get(config, 'apiary.token');
    this.name = nestcheck.get(config, 'apiary.api_name');
    this.sub_dom = nestcheck.get(config, 'apiary.sub_domain');
    this.port = config.port || 8000;
    this.language = nestcheck.get(config, "client.language");
    this.file = nestcheck.get(config, "client.file");
    this.classname = nestcheck.get(config, "client.classname");
    this.url = nestcheck.get(config, "client.url");
    this.package_name = nestcheck.get(config, 'package.name');
    this.version = nestcheck.get(config, 'package.version');
    this.description = nestcheck.get(config, 'package.description');
    this.author = nestcheck.get(config, 'package.author');
    this.license = nestcheck.get(config, 'package.license');
};
builder.prototype.genDocs = function (callback) {
    if (!this.token || !this.name) {
        return callback({err: 'Need proper apiary information'}, null)
    }
    var docGen = new apiaryGen({token: this.token, api_name: this.api_name, port: this.port});
    docGen.generate((err,r) => {
        if(err) {
            return callback(err,null);
        } else {
            return callback(null,r);
        }
    });
};
builder.prototype.makeClientLib = function (callback) {
    if (!this.language) {
        return callback({err:'Need to pass in client.language in config'},null)
    }
    var cmd = 'cli-codegen';
    if (this.language) {
        cmd += ` --l ${this.language}`
    }
    if (this.file) {
        cmd += ` --f ${this.file}`
    }
    if (this.classname) {
        cmd += ` --classname ${this.classname}`
    }
    if (this.url) {
        cmd += ` --url ${this.url}`
    }
    exec(cmd, (err, stdout, stderr) => {
        if (err || stderr) {
            console.log(err || stderr);
            return callback({err: 'Error using codegen'}, null)
        }
        else {
            return callback(null, {Generated: true})
        }
    })
};
builder.prototype.writePackage = function (callback) {
    var packageWrite = {
        "name": this.package_name || pack.name,
        "version": this.version || pack.version,
        "description": this.description || pack.description,
        "main": "index.js",
        "dependencies": {
            "q":"latest",
            "request":"latest"
        },
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": this.author || pack.author || null,
        "license": this.license || pack.license || null
    };
    fs.writeFile('./sdk/package.json', JSON.stringify(packageWrite), (err) => {
        if (err) {
            callback({err: 'Error writing package'}, null);
        } else {
            callback(null, {packageGen: true});
        }
    })

};
builder.prototype.writeReadme = function (callback) {
    var readme = `${this.name}
====

Docs located [Here](http://docs.${this.sub_dom}.apiary.io/#)`
    fs.writeFile('./sdk/readme.md', readme, (err) => {
        if (err) {
            callback({err: 'Error writing package'}, null);
        } else {
            callback(null, {readmeGen: true});
        }
    })

};
builder.prototype.publish = function (callback) {
    exec('npm publish', {cwd: './sdk'}, (err, stdout, stderr) => {
        if (err || stderr) {
            console.log(err || stderr);
            return callback({err: 'could not publish to npm'}, null)
        }
        else {
            return callback(null, {published: true})
        }
    });
};
module.exports = builder;