'use strict';

const user = require('../models/user');
// var bcSdk = require('../src/blockchain/blockchain_sdk');
// const users = 'risabh.s';
var bcSdk = require('../fabcar/invoke');

exports.registerOrg = (orgname, email, orgcontact, pin, rapidID) =>

    new Promise((resolve, reject) => {

        var transactionstring = {

            orgname: orgname,
            email: email,
            orgcontact: orgcontact,
            pin: pin,
            created_at: new Date(),
        }
        const newUser = new user({
            rapidID: rapidID,
            transactionstring:transactionstring     
        });

        newUser.save()

            .then(() => resolve({
                status: 201,
                message: 'User Registered Sucessfully !'
            }))

            .then(() => bcSdk.createUser({
                TransactionDetails: newUser
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already Registered !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            });
    });