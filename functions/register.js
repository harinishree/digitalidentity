'use strict';

const user = require('../models/user');
// var bcSdk = require('../src/blockchain/blockchain_sdk');
var bcSdk = require('../fabcar/invoke');
// const users = 'risabh.s';


exports.registerUser = (email, password, rapidID,userObject,usertype) =>

    new Promise((resolve, reject) => {

        const newUser = new user({

         
            email: email,
            password: password,
            rapidID: rapidID,
            userObject:userObject,
             usertype:usertype,
            created_at: new Date(),
        });
        newUser.save()

// var newUser = {

//     email: email,
//     password: password,
//     rapidID: rapidID,
//     userObject:userObject,
//      usertype:usertype,
//     created_at: new Date(),
// }

             bcSdk.createUser({
                UserDetails: newUser
            })
            .then(() => resolve({
                status: 201,
                message: 'User Registered Sucessfully !'
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