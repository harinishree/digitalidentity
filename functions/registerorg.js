'use strict';

const user = require('../models/user');
// var bcSdk = require('../src/blockchain/blockchain_sdk');
var bcSdk = require('../fabcar/invoke');
const users = 'risabh.s';


exports.registerOrg = (orgname, email, orgcontact, password, rapidID,usertype) =>

    new Promise((resolve, reject) => {

        const newUser = new user({

            orgname:orgname,
            email:email,
            orgcontact:orgcontact,
            password:password,
            rapidID:rapidID,
            usertype:usertype,
            created_at: new Date(),
        });

        newUser.save()

           
           bcSdk.createUser({
                
                UserDetails: newUser
            })

            .then((user) => resolve({
                
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