// All requests is GET request only

// import file
// express a framework for web server
const express = require('express');
const XLSX = require("xlsx");
const app = express();
var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("The access address is -> http://%s:%s", host, port);
});

// ioredis a framework for connecting to redis no relational database
const Redis = require('ioredis');

const redis = new Redis();
redis.on('error', function(err) {
    console.log("Connection error: " + err + "\n");
});
redis.on("ready", function() {
    console.log("Connection is ready to go" + "\n");
});

/**
 * Use xlsx module to convert excel to jsonData then feed data to database
 */
//row variable that counts number of rows and is used as id
var row = 0;
//this function needs to be called to work
//Use xlsx module to convert excel sheet to json data then loop through json and insert into database
function insertExcelData(){
    const workbook = XLSX.readFile("base.xlsx");
    let object;
    for(let sheetName of workbook.SheetNames){
        object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }
    for(let i = 0; i < object.length; i++){
        row = row + 1;
        //insertFromExcel(id, JSON.stringify(object[i]));
        insertFromExcel(row, object[i])
    }

    async function insertFromExcel(id, jsonData){
        await redis.hset(id, jsonData, function(err, result) {
            if (err) { // if insert has err occurs
                console.log(err); 
                throw err;
            } else {
                isCurd = true;
            } 
        });
    }
}

// check for if there is any update, delete, or insert data to the database,
// if false, we can get the data form the cache obj for saving time to search in the database
// if true, the we must go get the datas from the database.
var isCurd = true; 
// default value should be true because we need to search database for getting data ar the 1st time

// using template design pattern
app.get('/*', function(req, res) {
    //req = request
    //res = response
    var path = req.path;
    var query = req.query;
    var datas = null;

    if (path === '/') {
        // example link : http://localhost:8081/
        res.send("Hello, world!");

    } else if (path === '/get_all') {
        // example link : http://localhost:8081/get_all
        // get all the data from the database
        getByIdAll(req, res);

    } else if (path === '/get_by_id') {
        // example link : http://localhost:8081/get_by_id?id=value  
        // value is the id want to find
        getById(req, res, query.id);

    } else if (path === '/insert') {
        // example link : http://localhost:8081/insert?id=value&jsonData={}  
        // id value is the insert key, and jsonData is the insert value in json obj
        // it will insert as a hash set into database
        id = id + 1;
        insertData(req, res, id, JSON.parse(query.jsonData));

    } else if (path === '/get_by_id_suffix_like') {
        // example link : http://localhost:8081/get_by_id_suffix_like?suffix=value
        // find the data that the key is matching with '*' + suffix
        getByIdSuffixLike(req, res, query.suffix);

    } else if (path === '/get_by_id_prefix_like') {
        // example link : http://localhost:8081/get_by_id_prefix_like?prefix=value
        // find the data that the key is matching with prefix + '*'
        getByIdPrefixLike(req, res, query.prefix);

    } else if (path === '/get_by_id_all_like') {
        // example link : http://localhost:8081/get_by_id_all_like?regex=value
        // get all the data that the key is matching with '*'+ regex +'*'
        getByIdAllLike(req, res, query.regex);

    } else if (path === '/delete_by_id') {
        // example link : http://localhost:8081/delete_by_id?id=value
        // delete a record from the database based on the given id
        deleteById(req, res, query.id);

    } else if (path === '/delete_attribute_by_id') {
        // example link : http://localhost:8081/delete_attribute_by_id?id=value&attribute=value
        // delete an attribute from a record that is based on id
        deleteAttributeById(req, res, query.id, query.attribute);

    } else if (path === '/update_record') {
        // example link : http://localhost:8081/update_record?id=value&attribute=value&value=value
        // update a record based on the given id, attribute and new attribute value
        console.log('id -> ' + query.id);
        console.log('attribute -> ' + query.attribute);
        console.log('value -> ' + query.value);
        updateRecord(req, res, query.id, query.attribute, query.value);

    }
});

/**
 * update the record's attribute based on the given id, attribute, attribute value
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} id Unique identifier for the record
 * @param {*} attribute the attribute of the record
 * @param {*} value the value what to update
 */
async function updateRecord(req, res, id, attribute, value) {
    if (id == null || id.length == 0 || attribute == null || attribute.length == 0 || value == null || value.length == 0) {
        console.log("error deleting -> id/attribute/Update value is a invaild value");
        res.send("error deleting -> id/attribute/Update value is a invaild value");
        return;
    } 
    await redis.hset(id, attribute, value);
    isCurd = true;
    res.send("update a data successfully");
    console.log("update a data successfully");
}

/**
 * delete a record from the database based on the given id
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} id  Unique identifier for mapping the record
 */
async function deleteById(req, res, id) {
    if (id == null || id.length == 0) {
        console.log("error deleting -> id is a ivnvaild value");
        res.send("error deleting -> id is a ivnvaild value");
    }
    await redis.del(id);
    isCurd = true;
    res.send("delete a data successfully");
    console.log("delete a data successfully");
    // await redis.key(id, function(err, key) {
    //     if (key.length > 0) {
    //         redis.del(key);
    //     } else {
    //         console.log("error deleting -> id is a ivnvaild value");
    //     }
    // });
} 

/**
 * delete an attribute from a record that is based on id
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} id  Unique identifier for mapping the record
 * @param {*} attribute the attribute of the record
 */
async function deleteAttributeById(req, res, id, attribute) {
    if (id == null || id.length == 0 || attribute == null || attribute.length == 0) {
        console.log("error deleting -> id/attribute is a ivnvaild value");
        res.send("error deleting -> id/attribute is a ivnvaild value");
    }
    await redis.hdel(id, attribute);
    isCurd = true;
    console.log("delete " + attribute + " from record " + id + " successfully");
    res.send("delete " + attribute + " from record " + id + " successfully");
}

/**
 * insert one record of data into the database
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} id  Unique identifier for mapping the record
 * @param {*} jsonData  the data want to stored into the database
 */
async function insertData(req, res, id, jsonData) {
    if (id == null || id.length == 0) {
        console.error("no id specified");
        return;
    }

    if (jsonData == null) {
        console.log("no jsonData specified");
        return;
    }

    await redis.hset(id, jsonData, function(err, result) {
        if (err) { // if insert has err occurs
            console.log(err); 
            throw err;
        } else {
            isCurd = true;
            console.log(result);
            res.send("add successfully: \n" + result);
        } 
    });
}

/**
 * get the data from database base on the id parameter
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} id  Unique identifier for mapping the record
 */
var getbyidcache = {'id' : null, 'result' : null}; // cache obj for getById function
async function getById(req, res, id) {
    if (getbyidcache.id != id || isCurd) { 
        isCurd = false;
        console.log("check up data in database with id = " + id)
        data = await redis.hgetall(id); //return an object
        getbyidcache.id = id;
        getbyidcache.result = data;
        res.send(data); // display in web browser
        // return data;
    } else {
        console.log("display cached data with id = " + id);
        res.send(getbyidcache.result);
        // return getbyidcache.result;
    }
}

/**
 * get the data from database base on the suffix parameter
 * implementation see function getByIdAll(req, res, regex)
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} suffix the suffix part of the key
 */
async function getByIdSuffixLike(req, res, suffix) {
    if (getallcache.regex == ("*" + suffix) && isCurd == true) {
        console.log("display cached data with regex = *" + suffix + " with cache \n");
        res.send(getallcache.result);
        return;
    }

    if (suffix == null || suffix.length == 0) {
        getByIdAll(req, res);
    } else {
        getByIdAll(req, res, "*" + suffix);
    }
}

/**
 * get the data from database base on the prefix parameter
 * implementation see function getByIdAll(req, res, regex)
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} prefix the prefix of the key
 */
async function getByIdPrefixLike(req, res, prefix) {
    if (getallcache.regex == (prefix + "*") && isCurd == true) {
        console.log("display cached data with regex = " + prefix + "* with cache \n");
        res.send(getallcache.result);
        return;
    }

    if (prefix == null || prefix.length == 0) {
        getByIdAll(req, res);
    } else {
        getByIdAll(req, res, prefix + "*");
    }
}

/**
 * get the data from database base on the regex  parameter
 * implementation see function getByIdAll(req, res, regex)
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} regex 
 */
async function getByIdAllLike(req, res, regex) {
    if (getallcache.regex == ('*' + regex + '*') && isCurd == true) {
        console.log("display cached data with regex = *" + regex + "* with cache \n");
        res.send(getallcache.result);
        return;
    }

    if (regex == null || regex.length == 0) {
        getByIdAll(req, res);
    } else {
        getByIdAll(req, res, '*' + regex + '*');
    }
}

/**
 * get all the data from the database base on regex
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} regex the pattern that wnat to match with the key
 */
var getallcache = {'regex' : null , 'result' : null}; // cache obj for getByIdAll function
async function getByIdAll(req, res, regex = '*') {
    if (getallcache.regex != regex || isCurd) {
        isCurd = false;
        console.log("check up data in database with regex = " + regex + "\n");
        const allKeys = await redis.keys(regex); // return an array containing all the keys;
        // console.log(allKeys);
        const datas = [];
        var data;
        for (var i = 0; i < allKeys.length; i++) {
            data = await redis.hgetall(allKeys[i]); //return an object
            datas.push(data); // stored into array
        }
        getallcache.regex = regex;
        getallcache.result = datas;
        res.send(getallcache.result);
    } else {
        console.log("display cached data with regex = " + regex + " with cache \n");
        res.send(getallcache.result);
    }
}

