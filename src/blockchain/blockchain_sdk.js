/*eslint-env node */
//this file acctually acts as a wrapper around a the chaincode
//it directly sends the data which it receives from webservices to chaincode..and then the data is stored it in ledger
"use strict";

/**
@author: risabh sharma
@version: 3.0
@date: 04/02/2017
@Description: SDK to talk to blockchain using hfc
**/

var Promise = require('bluebird');
const config = require('config');
var logHelper = require('../logging/logging.js');
var logger = logHelper.getLogger('blockchain_sdk');
var validate = require('../utils/validation_helper.js');
var util = require('../utils/util.js');
var constants = require('../constants/constants.js');
var bcNetwork = require('../blockchain/blockchain_network.js');


var secure = true;
var retryLimit = 5;
var retryInterval = 2000;


/**
register a new user
**/
//function UserRegisteration receives all the data required for registeration from functions/register.js file 
function createUser(params) {

    console.log("calling SDK for creating user");
    return new Promise(function(resolve, reject) {
        var UserDetails;
        try {
            logHelper.logEntryAndInput(logger, 'creating User', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'createUser', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not create user. Invalid params' })
            }

            var user = params.user;
            console.log(user)
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'createUser', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid user' })
            }

            UserDetails = params.UserDetails._doc;
            console.log(JSON.stringify(UserDetails));

            if (!validate.isValidJson(UserDetails)) {
                logHelper.logError(logger, 'createUSer', 'Invalid UserDetails');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not create  userRegisteration. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register
            var reqSpec = getRequestSpec({ functionName: 'createUser', args: [UserDetails.rapidID] });
            recursiveInvoke({ requestSpec: reqSpec, user: user })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'UserRegisteration', 'Successfully registered user', resp.body);
                    return resolve({ statusCode: constants.SUCCESS, body: UserDetails });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'UserRegisteration', 'Could not register user', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });



}

function addDocument(params) {

    console.log("calling SDK for adding docs");
    return new Promise(function(resolve, reject) {
        var docDetails;
        try {
            logHelper.logEntryAndInput(logger, 'add doc', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'add document', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not add doc. Invalid params' })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'add document', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not add doc. Invalid user' })
            }

            docDetails = params.docDetails._doc;

            if (!validate.isValidJson(docDetails)) {
                logHelper.logError(logger, 'add document', 'Invalid docDetails');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not add doc. Invalid json object' })
            }

            var reqSpec = getRequestSpec({ functionName: 'addDocument', args: [docDetails.rapidID, docDetails.rapid_doc_ID] });
            recursiveInvoke({ requestSpec: reqSpec, user: user })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'add doc', 'Successfully added doc', resp.body);
                    return resolve({ statusCode: constants.SUCCESS, body: docDetails });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'add doc', 'Could not add doc', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not add doc' });

                });

        } catch (err) {
            logHelper.logError(logger, 'add doc', 'Could not add doc  on blockchain ledger: ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not add doc' });
        }
    });
}

function shareDocument(params) {

    console.log("calling SDK for sharedocs");
    return new Promise(function(resolve, reject) {
        var sharedDocs;
        try {
            logHelper.logEntryAndInput(logger, 'sharedocs', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'sharedocs', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not sharedocs. Invalid params' })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'sharedocs', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not sharedocs. Invalid user' })
            }

            sharedDocs = params.sharedDocs;

            if (!validate.isValidJson(sharedDocs)) {
                logHelper.logError(logger, 'sharedocs', 'Invalid json ');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not sharedocs. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register
            console.log(sharedDocs)
            var reqSpec = getRequestSpec({
                functionName: 'shareDocument',
                args: [


                    sharedDocs.rapidID,
                    sharedDocs.rapid_doc_ID,
                    sharedDocs.OrgID

                ]
            });

            recursiveInvoke({ requestSpec: reqSpec, user: user })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'sharedocument', 'Successfully shared your doc', resp.body);
                    return resolve({ statusCode: constants.SUCCESS, body: sharedDocs });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'sharedocument', 'Could not share your doc', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not share doc' });

                });

        } catch (err) {
            logHelper.logError(logger, 'sharedocument', 'Could not share doc on blockchain ledger: ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not share doc of user' });
        }
    });
}

function revokeAccess(params) {

    console.log("calling SDK for revoke access");
    return new Promise(function(resolve, reject) {
        var revokeAccess;
        try {
            logHelper.logEntryAndInput(logger, ' revokeAccess', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'revokeAccess', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not revokeAccess. Invalid params' })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'revokeAccess', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not  revokeAccess. Invalid user' })
            }

            revokeAccess = params.revokeAccess;

            if (!validate.isValidJson(revokeAccess)) {
                logHelper.logError(logger, 'revokeAccess', 'Invalid json ');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could revokeAccess. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register

            var reqSpec = getRequestSpec({
                functionName: 'revokeAccess',
                args: [


                    revokeAccess.rapidID,
                    revokeAccess.orgID,
                    revokeAccess.rapid_doc_ID


                ]
            });

            recursiveInvoke({ requestSpec: reqSpec, user: user })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'revokeAccess', 'Successfully revoked Access', resp.body);
                    return resolve({ statusCode: constants.SUCCESS, body: revokeAccess });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'revokeAccess', 'Could not revokeAccess', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not revokeAccess' });

                });

        } catch (err) {
            logHelper.logError(logger, 'revokeAccess', 'Could not revokeAccess on blockchain ledger: ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not revokeAccess' });
        }
    });
}


function removedocs(params) {

    console.log("calling SDK for deletedocs");
    return new Promise(function(resolve, reject) {
        var deletedocs;
        try {
            logHelper.logEntryAndInput(logger, 'deletedocs', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'deletedocs', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not deletedoc. Invalid params' })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'deletedocs', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not  deletedocs. Invalid user' })
            }

            deletedocs = params.deleteDocs;

            if (!validate.isValidJson(deletedocs)) {
                logHelper.logError(logger, 'deletedocs', 'Invalid json ');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not deletedocs. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register

            var reqSpec = getRequestSpec({
                functionName: 'removeDocument',
                args: [


                    deletedocs.rapidID,
                    deletedocs.rapid_doc_ID

                ]
            });

            recursiveInvoke({ requestSpec: reqSpec, user: user })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'deletedocs', 'Successfully deleted docs', resp.body);
                    return resolve({ statusCode: constants.SUCCESS, body: deletedocs });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'deletedocs', 'Could not delete docs', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not delete docs' });

                });

        } catch (err) {
            logHelper.logError(logger, 'revokeAccess', 'Could not delete docs on blockchain ledger: ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not delete docs' });
        }
    });
}


function getMydocs(params) {
    console.log(params, 'data in params for query method')
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'getMydocs', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'getMydocs', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not fetch docs. Invalid params' })
            }



            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'getMydocs', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not fetch docs. Invalid user' })
            }


            var getMydocs = params.rapidID;
            if (!validate.isValidString(getMydocs)) {
                logHelper.logError(logger, 'getMydocs', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not fetch docs. Invalid user' })
            }
            var reqSpec = getRequestSpec({ functionName: 'getMydocs', args: [getMydocs] });
            recursiveQuery({ requestSpec: reqSpec, user: user })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'getMydocs', 'Successfully fetched docs', resp.body);
                    return resolve({ statusCode: constants.SUCCESS, body: resp.body });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'getMydocs', 'Could not fetch user details', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch  docs' });

                });

        } catch (err) {
            logHelper.logError(logger, 'getMydocs', 'Could not fetch property ad ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch docs' });
        }
    });
}

function getSharedDocs(params) {
    console.log(params, 'data in params for query method')
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'getSharedDocs', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'getSharedDocs', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid params' })
            }



            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'getSharedDocs', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }


            var getMydocs = params.rapidID;
            if (!validate.isValidString(getMydocs)) {
                logHelper.logError(logger, 'getSharedDocs', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }
            var reqSpec = getRequestSpec({ functionName: 'getSharedDocs', args: [getMydocs] });
            recursiveQuery({ requestSpec: reqSpec, user: user })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'getSharedDocs', 'Successfully fetched shared docs', resp.body);
                    return resolve({ statusCode: constants.SUCCESS, body: resp.body });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'getSharedDocs', 'Could not fetch shared docs', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch shared docs' });

                });

        } catch (err) {
            logHelper.logError(logger, 'getSharedDocs', 'Could not fetch property ad ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch shraded docs' });
        }
    });
}

/**
Generates the request object for invoke and query calls using hfc
**/
function getRequestSpec(params) {

    if (!validate.isValidJson(params)) {
        logHelper.logError(logger, 'getRequestSpec', 'Invalid params');
        throw new Error("Invalid params");
    }

    var chaincodeID = config['chaincode']['id']; //util.getUserDefinedProperty(constants['BLOCKCHAIN_CHAINCODE'])['id'];
    if (!validate.isValidString(chaincodeID)) {
        logHelper.logError(logger, 'getRequestSpec', 'Invalid chaincodeID');
        throw new Error("Invalid chaincodeID");
    }

    var functionName = params.functionName;
    if (!validate.isValidString(functionName)) {
        logHelper.logError(logger, 'getRequestSpec', 'Invalid function name');
        throw new Error("Invalid function name");
    }

    var args = []

    if (validate.isValidArray(params.args)) {
        args = params.args;
    }

    //     var attributes = ['username', 'role']

    //   if(validate.isValidArray(params.attributes)){
    //     attributes = params.attributes;


    var spec = {
        chaincodeID: chaincodeID,
        fcn: functionName,
        args: args
            //  attrs: attributes
    }

    return spec;
}


/**
Performs query operation on blockchain
**/
function doQuery1(params) {
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'doQuery', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'doQuery', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid params' })
            }

            var requestSpec = params.requestSpec;
            if (!validate.isValidJson(requestSpec)) {
                logHelper.logError(logger, 'doQuery', 'Invalid requestSpec');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid requestSpec' })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'doQuery', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid user' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(user)
                .then(function(member) {

                    var tx = member.query(requestSpec);
                    tx.on('submitted', function() {
                        logHelper.logMessage(logger, 'doQuery', 'Transaction for query submitted');
                    });

                    tx.on('complete', function(data) {
                        try {
                            logHelper.logMessage(logger, 'doQuery', 'data in data.result ', data.result);
                            var buffer = new Buffer(data.result);
                            logHelper.logMessage(logger, 'doQuery', 'data in buffer.tostring ', buffer.toString());
                            var jsonResp = (buffer.toString());
                            return resolve({ statusCode: constants.SUCCESS, body: jsonResp });
                        } catch (err) {
                            logHelper.logError(logger, 'doQuery', 'Could not parse query response', err);
                            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not parse query response ' });
                        }
                    });

                    tx.on('error', function(err) {
                        logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
                        return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });

                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
                })

        } catch (err) {
            logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
        }
    });


}

function doQuery(params) {
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'doQuery', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'doQuery', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid params' })
            }

            var requestSpec = params.requestSpec;
            if (!validate.isValidJson(requestSpec)) {
                logHelper.logError(logger, 'doQuery', 'Invalid requestSpec');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid requestSpec' })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'doQuery', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid user' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(user)
                .then(function(member) {

                    var tx = member.query(requestSpec);
                    tx.on('submitted', function() {
                        logHelper.logMessage(logger, 'doQuery', 'Transaction for query submitted');
                    });

                    tx.on('complete', function(data) {
                        try {
                            logHelper.logMessage(logger, 'doQuery', 'data in data.result ', data.result);
                            var buffer = new Buffer(data.result);
                            logHelper.logMessage(logger, 'doQuery', 'data in buffer.tostring ', buffer.toString());
                            var jsonResp = JSON.parse(buffer.toString());
                            return resolve({ statusCode: constants.SUCCESS, body: jsonResp });
                        } catch (err) {
                            logHelper.logError(logger, 'doQuery', 'Could not parse query response', err);
                            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not parse query response ' });
                        }
                    });

                    tx.on('error', function(err) {
                        logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
                        return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });

                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
                })

        } catch (err) {
            logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
        }
    });

}


/**
Performs invoke operation on blockchain
**/
function doInvoke(params) {
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'doInvoke', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'doInvoke', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid params' })
            }

            var requestSpec = params.requestSpec;
            if (!validate.isValidJson(requestSpec)) {
                logHelper.logError(logger, 'doInvoke', 'Invalid requestSpec');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid requestSpec' })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'doInvoke', 'Invalid user');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid user' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);


            chainAsync.getMemberAsync(user)
                .then(function(member) {

                    var tx = member.invoke(requestSpec);
                    tx.on('submitted', function(data) {
                        logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke submitted ', requestSpec);
                        return resolve({ statusCode: constants.SUCCESS, body: data });

                    });

                    tx.on('complete', function(data) {
                        logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke complete ', data);

                    });

                    tx.on('error', function(err) {
                        logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ', err);
                        return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });

                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ', err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
                })

        } catch (err) {
            logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ', err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
        }
    });

}

/*Performs register on Blockchain CA*/
function doRegister(params) {
    return new Promise(function(resolve, reject) {

        var username;
        try {
            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'registerUser', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid params' })
            }

            username = params.username;
            if (!validate.isValidString(username)) {
                logHelper.logError(logger, 'registerUser', 'Invalid username');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid username' })
            }

            var affiliation = params.affiliation;
            if (!validate.isValidString(affiliation)) {
                logHelper.logError(logger, 'registerUser', 'Invalid affiliation');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid affiliation' })
            }

            var roles = params.roles;
            if (!validate.isValidArray(roles)) {
                roles = ['client'];
            }

            var enrollsecret
            var chain = bcNetwork.getChain();
            var reg = chain.getRegistrar();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    var memberAsync = Promise.promisifyAll(member);

                    var registrationRequest = {
                        enrollmentID: username,
                        attributes: [
                            { name: 'role', value: affiliation },
                            { name: 'username', value: username }
                        ],
                        affiliation: 'group1',
                        registrar: reg,
                        roles: roles

                    };

                    return memberAsync.registerAsync(registrationRequest);
                })
                .then(function(enrollsec) {
                    logHelper.logMessage(logger, 'registerUser', 'Successfully registered user on blockchain: ' + username);
                    enrollsecret = enrollsec;
                    return resolve({ statusCode: constants.SUCCESS, body: { password: enrollsecret } });

                })
                .catch(function(err) {
                    logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: ' + username, err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
                })
        } catch (err) {
            logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: ' + username, err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });

}

/**
Enroll user with the Blockchain CA
**/
function doLogin(params) {
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logMethodEntry(logger, 'doLogin');
            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'doLogin', 'Invalid params');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid params' })
            }

            var username = params.username;
            if (!validate.isValidString(username)) {
                logHelper.logError(logger, 'doLogin', 'Invalid username');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid username' })
            }

            var password = params.password;
            if (!validate.isValidString(password)) {
                logHelper.logError(logger, 'doLogin', 'Invalid account');
                return reject({ statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid password' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    var memberAsync = Promise.promisifyAll(member);
                    return memberAsync.enrollAsync(password);
                })
                .then(function(crypto) {
                    logHelper.logMessage(logger, 'doLogin', 'Successfully logged in user on blockchain: ' + username);
                    return resolve({ statusCode: constants.SUCCESS, body: crypto });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'doLogin', 'Could not login user on blockchain: ' + username, err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not login user' });
                });

        } catch (err) {
            logHelper.logError(logger, 'doLogin', 'Could not register user on blockchain: ' + username, err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveRegister(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doRegister(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveRegister', "Register Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            return recursiveRegister(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveLogin(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doLogin(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveLogin', "Login Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            return recursiveLogin(params);
        });
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveInvoke(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doInvoke(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retries Exhausted", err);
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retry " + params.retryCounter, err)
            return recursiveInvoke(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveQuery(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doQuery(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveQuery', "Query Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            logHelper.logError(logger, 'recursiveQuery', "Query Retry " + params.retryCounter, err)
            return recursiveQuery(params);
        });
    });
}

function recursiveQuery1(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doQuery1(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveQuery', "Query Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            logHelper.logError(logger, 'recursiveQuery', "Query Retry " + params.retryCounter, err)
            return recursiveQuery(params);
        });
    });
}

function isUserRegistered(params) {
    return new Promise(function(resolve, reject) {
        try {
            logHelper.logMethodEntry(logger, 'isUserRegistered');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    return resolve({ statusCode: constants.SUCCESS, body: member.isRegistered() });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status ' + username, err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user registration status' });
                });
        } catch (err) {
            logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status ' + username, err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user registration status' });
        }
    })

}

function isUserEnrolled(params) {
    return new Promise(function(resolve, reject) {
        try {
            logHelper.logMethodEntry(logger, 'isUserEnrolled');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    return resolve({ statusCode: constants.SUCCESS, body: member.isEnrolled() });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status ' + username, err);
                    return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user enrollment status' });
                });
        } catch (err) {
            logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status ' + username, err);
            return reject({ statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user enrollment status' });
        }
    });

}

module.exports = {
    createUser: createUser,
    addDocument: addDocument,
    shareDocument: shareDocument,
    revokeAccess: revokeAccess,
    getMydocs: getMydocs,
    getSharedDocs: getSharedDocs,
    removedocs: removedocs,
    recursiveRegister: recursiveRegister,
    recursiveLogin: recursiveLogin,
    isUserEnrolled: isUserEnrolled,
    isUserRegistered: isUserRegistered
};