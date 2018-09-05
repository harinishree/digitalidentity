'use strict';

// const user = require('../models/user');
var bcSdk = require('../fabcar/invoke');



exports.registerUser = (email, password, rapidID,userObject,usertype) => {


  return new Promise((resolve, reject) => {

        var transactionstring = {
            email: email,
            password: password,
            userObject:userObject,
             usertype:usertype,
            created_at: new Date(),
        }

        // const newUser = new user({
        //     rapidID: rapidID,
        //     transactionstring:transactionstring 
        // });

        var newUser = {
            rapidID: rapidID,
            transactionstring:transactionstring 
        }
        
        // newUser.save()
        bcSdk.createUser({
            TransactionDetails: newUser
        })
        
        // .then((result) => 
        // bcSdk.createUser({
        //     TransactionDetails: newUser
        // }))

            .then((result) =>
            
              resolve({
                status: 201,
                message: 'User Registered Sucessfully !',
               
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
            })    
    });

}


