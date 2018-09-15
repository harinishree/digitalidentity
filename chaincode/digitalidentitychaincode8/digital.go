/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

/*package main
/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
 package main
 import (
     
     "encoding/json"
     "fmt"
     "time"
     "github.com/hyperledger/fabric/core/chaincode/shim"
     sc "github.com/hyperledger/fabric/protos/peer"
 )
  type IndexItem struct {
     // Requestid string    `json:"requestid"`
    UserId    string    `json:"userid"`
     
  }
 
 type DocumentInfo struct {
	Owner string   `json:"owner"`
	Docs  []string `json:"docs"`
}

type User struct {
	Owns []string `json:"owns"`
	//SharedwithMe []DocumentInfo `json:"sharedwithme"`
	SharedwithMe map[string][]string `json:"sharedwithme"`
	Auditrail    map[string][]string `json:"audittrail"`
}
  
 type SimpleChaincode struct {
 }
 func (t *SimpleChaincode) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
       var index []IndexItem
     jsonAsBytes, err := json.Marshal(index)
     if err != nil {
         fmt.Println("Could not marshal index object", err)
         return shim.Error("error")
     }
     err = APIstub.PutState("index", jsonAsBytes)
     if err != nil {
         fmt.Println("Could not save updated index ", err)
         return shim.Error("error")
     }
     return shim.Success(nil)
 }
 func (t *SimpleChaincode) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
     function, args := APIstub.GetFunctionAndParameters()
     switch function {
     case "createUser":
         return t.createUser(APIstub, args)
     case "addDocument":
         return t.addDocument(APIstub, args)
     case "shareDocument":
         return t.shareDocument(APIstub, args)
     case "getMydocs":
		 return t.getMydocs(APIstub, args)
	case "getSharedDocs":
		return t.getMydocs(APIstub, args)
    case "revokeAccess":
		return t.revokeAccess(APIstub,args)
	case "removeDocument":
        return t.removeDocument(APIstub,args)
    
     }
     return shim.Error("Invalid Smart Contract function name.")
 }
 //1.newrequest   (#user,#transactionlist)
 func (t *SimpleChaincode) createUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	//func createUser(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	fmt.Println("Entering createUser")

	if len(args) < 1 {
		fmt.Println("Expecting One Argument")
		return shim.Error("Expected at least one arguments for adding a user")
	}

	var userid = args[0]
	var userinfo = `{"owns":[],"mymap":{}, "audit":{}}`
	err := APIstub.PutState(userid, []byte(userinfo))
	if err != nil {
		fmt.Println("Could not save user to ledger")
		return shim.Error("Could not save user to ledger")
	}

	fmt.Println("Successfully saved user/org")
	return shim.Success(nil)
}
 //2.addDocument()   (#user,#doc)
func (t *SimpleChaincode) addDocument(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering addDocument")
	var user User
	if len(args) < 2 {
		fmt.Println("Expecting two Argument")
		return shim.Error("Expected at least two arguments for adding a document")
	}

	var userid = args[0]
	fmt.Println(userid)
	var docid = args[1]
	fmt.Println(docid)
	bytes, err := APIstub.GetState(userid)
	if err != nil {
		return shim.Error("Error")
	}

	err = json.Unmarshal(bytes, &user)
	fmt.Println("unmarshal", bytes, &user)
	if err != nil {
		fmt.Println("unable to unmarshal user data")
		return shim.Error("Error")
	}

	user.Owns = append(user.Owns, docid)

	_, err = writeIntoBlockchain(userid, user, APIstub)
	if err != nil {
		fmt.Println("Could not save add doc to user", err)
		return shim.Error("Error")
	}

	fmt.Println("Successfully added the doc")
	return shim.Success(nil)

}
 //3. shareDocument()    (#doc,#user, #org)  Invoke
func (t *SimpleChaincode) shareDocument(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering shareDocument")
	var user User
	var org User
	//	var doc DocumentInfo
	//fmt.Println(doc)
	if len(args) < 2 {
		fmt.Println("Expecting three Argument")
		return shim.Error("Expected at least three arguments for sharing  a document")
	}

	var userid = args[0]
	var docid = args[1]
	var orgid = args[2]
	//fetching the user
	userbytes, err := APIstub.GetState(userid)
	if err != nil {
		fmt.Println("could not fetch user", err)
		return shim.Error("could not fetch user")
	}
	err = json.Unmarshal(userbytes, &user)
	if err != nil {
		fmt.Println("unable to unmarshal user data")
		return shim.Error("unable to unmarshal user data")
	}
	if !contains(user.Owns, docid) {
		fmt.Println("docment doesnt exists")
		return shim.Error("docment doesnt exists")
	}
	//fetch oraganisation
	orgbytes, err := APIstub.GetState(orgid)
	if err != nil {
		fmt.Println("could not fetch user", err)
		return shim.Error("could not fetch user")
	}
	err = json.Unmarshal(orgbytes, &org)
	if err != nil {
		fmt.Println("unable to unmarshal org data")
		return shim.Error("unable to unmarshal org data")
	}

	if org.SharedwithMe == nil {
		org.SharedwithMe = make(map[string][]string)
	}

	if user.Auditrail == nil {
		user.Auditrail = make(map[string][]string)

	}
	//adding the document if it doesnt exists already
	if !contains(org.SharedwithMe[userid], docid) {
		timestamp := makeTimestamp()
		fmt.Println(timestamp)
		//---------------Sharing the doc to Organisation-----------------------
		org.SharedwithMe[userid] = append(org.SharedwithMe[userid], docid)

		//-------------- Adding time stamp to user audit trail array-------------
		user.Auditrail[orgid] = append(user.Auditrail[orgid], timestamp)
		user.Auditrail[orgid] = append(user.Auditrail[orgid], docid)
	}

	_, err = writeIntoBlockchain(orgid, org, APIstub)
	if err != nil {
		fmt.Println("Could not save org Info", err)
		return shim.Error("Could not save org Info")
	}

	_, err = writeIntoBlockchain(userid, user, APIstub)
	if err != nil {
		fmt.Println("Could not save user Info", err)
		return shim.Error("Could not save user Info")
	}

	fmt.Println("Successfully shared the doc")
	return shim.Success(nil)

}
 
//4. getMydocs()    (#user) Query
func (t *SimpleChaincode) getMydocs(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering get my docs")

	if len(args) < 1 {
		fmt.Println("Invalid number of arguments")
		return shim.Error("Error")
	}

	var userid = args[0]
	idasbytes, err := APIstub.GetState(userid)
	if err != nil {
		fmt.Println("Could not user info", err)
		return shim.Error("Error")
	}
	return shim.Success(idasbytes)
}

 func (t *SimpleChaincode) revokeAccess(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
        if len(args) < 3 {
            fmt.Println("Expecting a minimum of three arguments Argument")
            return shim.Error("Expected at least one arguments for adding a user")
        }
    
        var userhash = args[0]
        var orghash = args[1]
        var dochash = args[2]
		fmt.Println("Expecting Argument",userhash,orghash,dochash)

        var org User
    
        org, err := readFromBlockchain(orghash, APIstub)
        if err != nil {
            return shim.Error("failed to read")
        }
		fmt.Println("Expecting Argument",org)

        userDocsArray := org.SharedwithMe[userhash]
		fmt.Println("Expecting Argument",userDocsArray)

        // removes that particular document from the array
        for i, v := range userDocsArray {
            if v == dochash {
                userDocsArray = append(userDocsArray[:i], userDocsArray[i+1:]...)
                break
            }
        }
    
        //assign that array to the user map key
        org.SharedwithMe[userhash] = userDocsArray
    
        _, err = writeIntoBlockchain(orghash, org, APIstub)
        if err != nil {
            fmt.Println("Could not save add doc to user")
            return shim.Error("Could not save add doc to user")
        }
    
        fmt.Println("Successfully revoked access to the doc")
        return shim.Success(nil)
    
	}
	
	func (t *SimpleChaincode) removeDocument(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
		if len(args) < 2 {
			fmt.Println("Expecting a minimum of three arguments Argument")
			return shim.Error("Expected at least one arguments for adding a user")
		}
	
		var userhash = args[0]
		var dochash = args[1]
		var user User
		var err error
		user, err = readFromBlockchain(userhash, APIstub)
		if err != nil {
			return shim.Error("failed to read")
		}
	
		for i, v := range user.Owns {
			if v == dochash {
				user.Owns = append(user.Owns[:i], user.Owns[i+1:]...)
				break
			}
		}
	
		_, err = writeIntoBlockchain(userhash, user, APIstub)
		if err != nil {
			fmt.Println("Could not save add doc to user", err)
			return shim.Error("Could not save add doc to user")
		}
	
		fmt.Println("Successfully removed the doc")
		return shim.Success(nil)
	
	}
	
 func makeTimestamp() string {
     t := time.Now()
     return t.Format(("2006-01-02T15:04:05.999999-07:00")) 
     //return time.Now().UnixNano() / (int64(time.Millisecond)/int64(time.Nanosecond))
 }
 // The main function is only relevant in unit test mode. Only included here for completeness.
 func main() {
     // Create a new Smart Contract
     err := shim.Start(new(SimpleChaincode))
     if err != nil {
         fmt.Printf("Error creating new Smart Contract: %s", err)
     }
 }

 func contains(slice []string, item string) bool {
	set := make(map[string]struct{}, len(slice))
	for _, s := range slice {
		set[s] = struct{}{}
	}

	_, ok := set[item]
	return ok
}

 func writeIntoBlockchain(key string, value User, APIstub shim.ChaincodeStubInterface) ([]byte, error) {
	bytes, err := json.Marshal(&value)
	if err != nil {
		fmt.Println("Could not marshal info object", err)
		return nil, err
	}

	err = APIstub.PutState(key, bytes)
	if err != nil {
		fmt.Println("Could not save sharing info to org", err)
		return nil, err
	}

	return nil, nil
}

func readFromBlockchain(key string, APIstub shim.ChaincodeStubInterface) (User, error) {

	fmt.Println("Unable to marshal data",key)

	userbytes, err := APIstub.GetState(key)
	var user User
	fmt.Println("Unable to marshal data", userbytes, err)

	if err != nil {
		fmt.Println("could not fetch user", err)
		return user, err
	}
	fmt.Println("Unable to marshal data", userbytes, &user)
	err = json.Unmarshal(userbytes, &user)
	if err != nil {
		fmt.Println("Unable to marshal data", err)
		return user, err
	}

	return user, nil
}