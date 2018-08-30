'use strict';

const users = "risabh.s";
var bcSdk = require('../fabcar/invoke');
exports.shareDocument = (rapidID, rapid_doc_ID, orgID) =>

    new Promise((resolve, reject) => {

        var transactionstring = {
            rapid_doc_ID: rapid_doc_ID,
            orgID: orgID
        }


        const shareDoc = ({

            rapidID: rapidID,
            transactionstring:transactionstring

        })

        bcSdk.shareDocument({
                
                sharedDocDetails: shareDoc
            })

            .then(() => resolve({
                status: 201,
                message: 'User Sucessfully shared doccument !'
            }))

            .catch(err => {

                reject({
                    status: 500,
                    message: 'Internal Server Error !'
                });
            });
    });