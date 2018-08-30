'use strict';

const doc = require('../models/doc');
var bcSdk = require('../fabcar/invoke');

exports.addDoc = (docType, docNo, rapid_doc_ID, rapidID, docinfo) =>

    new Promise((resolve, reject) => {

        var transactionstring = {
            docType: docType,
            docNo: docNo,
            rapid_doc_ID: rapid_doc_ID,
            docinfo: docinfo
        }

        const newDoc = new doc({

            rapidID: rapidID,
            transactionstring:transactionstring
            
        })

        newDoc.save()



            .then(() => resolve({
                status: 201,
                message: 'User Sucessfully added doccument !'
            }))

            .then(() => bcSdk.addDocument({
             
                updatedetails: newDoc
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'document already exists!'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            });
    });