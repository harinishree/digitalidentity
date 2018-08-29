'use strict';

const user = require('../models/user');
var bcSdk = require('../src/blockchain/blockchain_sdk');
const users = 'risabh.s';


exports.registerUser = (email, password, rapidID,userObject,usertype) =>

    new Promise((resolve, reject) => {

        const newUser = new user({

         
            email: email,
            password: password,
            rapidID: rapidID,
            userObject:userObject,
             usertype :usertype,
            created_at: new Date(),
        });
        newUser.save()




            .then(() => resolve({
                status: 201,
                message: 'User Registered Sucessfully !'
            }))

            .then(() => bcSdk.createUser({
                user: users,
                UserDetails: newUser
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