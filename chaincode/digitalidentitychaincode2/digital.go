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
     "bytes"
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
 type Request struct {
    
     Transactionlist []Transaction `json:"transactionlist"`
 }
 type Transaction struct {
     TrnsactionDetails map[string]string `json:"transactiondetails"`
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
     case "newRequest":
         return t.newRequest(APIstub, args)
     case "updateRequest":
         return t.updateRequest(APIstub, args)
     case "readIndex":
         return t.readIndex(APIstub, args)
     case "readRequest":
         return t.readRequest(APIstub, args)
     case "readAllRequest":
     return t.readAllRequest(APIstub,args)
    case "revokeAccess":
        return t.revokeAccess(APIstub,args)
    case "getHistory":
        return t.getHistory(APIstub,args)

     }
     return shim.Error("Invalid Smart Contract function name.")
 }
 //1.newrequest   (#user,#transactionlist)
 func (t *SimpleChaincode) newRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
     // creating new request
     // {requestid : 1234, involvedParties:['supplier', 'logistics', 'manufacturer','insurance']}
     fmt.Println("creating new newRequest")
     if len(args) < 2 {
         fmt.Println("Expecting three Argument")
         return shim.Error("Expected three arguments for new Request")
     }
    //  var request Request
    //  var indexItem IndexItem
    //  var transaction Transaction
    //  var index []IndexItem
    
     var userId = args[0]
     var transactionString = args[1]
    // var userId = args[2]
     fmt.Println(userId)
    // fmt.Println(userId)
    err := APIstub.PutState(userId,[]byte(transactionString))
     
	if err != nil {
		fmt.Println("Could not save user to ledger", err)
		//return nil, err
		return shim.Error("error")
	}
		



	jsonAsBytes, err := json.Marshal(userId)
	if err != nil {
		fmt.Println("Could not marshal index object", err)
		return shim.Error("Could not marshal index object")
	}
	err = APIstub.PutState("index", jsonAsBytes)
	if err != nil {
		fmt.Println("Could not save updated index ", err)
		return shim.Error("error")
	}
	fmt.Println("index", jsonAsBytes)
	fmt.Println("Successfully saved")
	return shim.Success(nil)
}
 //2.updateRequest
 func (t *SimpleChaincode) updateRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
     // creating new request
     // {requestid : 1234, involvedParties:['supplier', 'logistics', 'manufacturer','insurance']}
     fmt.Println("creating new newRequest")
     if len(args) < 2 {
         fmt.Println("Expecting three Argument")
         return shim.Error("Expected three arguments for new Request")
     }
    //  var transaction Transaction
    //  var request Request
    //  var indexItem IndexItem
    //  var index []IndexItem
   
     var userId = args[0]
    
     var transactionString = args[1]
    //  var userId = args[2]
     fmt.Println(userId)
    //  fmt.Println(userId)
     
	err := APIstub.PutState(userId,[]byte(transactionString))
     
	if err != nil {
		fmt.Println("Could not save user to ledger", err)
		//return nil, err
		return shim.Error("error")
	}
		



	jsonAsBytes, err := json.Marshal(userId)
	if err != nil {
		fmt.Println("Could not marshal index object", err)
		return shim.Error("Could not marshal index object")
	}
	err = APIstub.PutState("index", jsonAsBytes)
	if err != nil {
		fmt.Println("Could not save updated index ", err)
		return shim.Error("error")
	}
	fmt.Println("index", jsonAsBytes)
	fmt.Println("Successfully saved")
	return shim.Success(nil)
}
 //3. readRequest    (#user) Query
 func (t *SimpleChaincode) readIndex(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
     // querying the request
     //var index []IndexItem
     indexAsBytes, _ := APIstub.GetState("index")
     //json.Unmarshal(reqAsBytes, &index)
     return shim.Success(indexAsBytes)
 }
 //4.readtransactionList  (#user) Query
 func (t *SimpleChaincode) readRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
     // querying the request
     //var request Request
     fmt.Println("Reading the request data for ", args[0])
     reqAsBytes, _ := APIstub.GetState(args[0])
     //json.Unmarshal(reqAsBytes, &request)
     return shim.Success(reqAsBytes)
 }
 //5.readAlldetails
 func (t *SimpleChaincode) readAllRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    //startKey := args[0]
    //endKey := args[1]
    fmt.Println("0",args[0])
    fmt.Println("1",args[1])

  resultsIterator, err := APIstub.GetStateByRange( args[0], args[1])
   if err != nil {
    return shim.Error(err.Error())
}
defer resultsIterator.Close()

// buffer is a JSON array containing QueryResults
var buffer bytes.Buffer
buffer.WriteString("[")

bArrayMemberAlreadyWritten := false
for resultsIterator.HasNext() {
    queryResponse, err := resultsIterator.Next()
    if err != nil {
        return shim.Error(err.Error())
    }
    // Add a comma before array members, suppress it for the first array member
    if bArrayMemberAlreadyWritten == true {
        buffer.WriteString(",")
    }
    buffer.WriteString("{\"Key\":")
    buffer.WriteString("\"")
    buffer.WriteString(queryResponse.Key)
    buffer.WriteString("\"")

    buffer.WriteString(", \"Record\":")
    // Record is a JSON object, so we write as-is
    buffer.WriteString(string(queryResponse.Value))
    buffer.WriteString("}")
    bArrayMemberAlreadyWritten = true
}
buffer.WriteString("]")

fmt.Printf("- alldata:\n%s\n", buffer.String())

return shim.Success(buffer.Bytes())
}

 func (t *SimpleChaincode) getHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    
       fmt.Println("0",args[0])
    
      interatorArray, err := APIstub.GetHistoryForKey(args[0])
        if err != nil {
            return shim.Error(err.Error())
        }
        defer interatorArray.Close()
    
      // buffer is a JSON array containing QueryResults
    var buffer bytes.Buffer
    buffer.WriteString("[")
    
    bArrayMemberAlreadyWritten := false
    for interatorArray.HasNext() {
        queryResponse, err := interatorArray.Next()
        if err != nil {
            return shim.Error(err.Error())
        }
        // Add a comma before array members, suppress it for the first array member
        if bArrayMemberAlreadyWritten == true {
            buffer.WriteString(",")
        }
        //  buffer.WriteString("{\"Key\":")
        //  buffer.WriteString("\"")
        //  //buffer.WriteString(queryResponse.Key)
        // buffer.WriteString("\"")
        fmt.Println("query response ===============>",queryResponse)
        buffer.WriteString("{ \"Records\":")
        // Record is a JSON object, so we write as-is
        buffer.WriteString(string(queryResponse.Value))
        buffer.WriteString("}")
        bArrayMemberAlreadyWritten = true
    }
    buffer.WriteString("]")
    
    fmt.Printf("- alldata:\n%s\n", buffer.String())
    
    return shim.Success(buffer.Bytes())
    } 

    func (t *SimpleChaincode) revokeAccess(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
        if len(args) < 3 {
            fmt.Println("Expecting a minimum of three arguments Argument")
            return shim.Error("Expected at least one arguments for adding a user")
        }
    
        var userhash = args[0]
        var orghash = args[1]
        var dochash = args[2]
    
        var org User
    
        org, err := readFromBlockchain(orghash, APIstub)
        if err != nil {
            return shim.Error("failed to read")
        }
    
        userDocsArray := org.SharedwithMe[userhash]
    
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

 func writeIntoBlockchain(key string, value User, stub shim.ChaincodeStubInterface) ([]byte, error) {
	bytes, err := json.Marshal(&value)
	if err != nil {
		fmt.Println("Could not marshal info object", err)
		return nil, err
	}

	err = stub.PutState(key, bytes)
	if err != nil {
		fmt.Println("Could not save sharing info to org", err)
		return nil, err
	}

	return nil, nil
}

func readFromBlockchain(key string, stub shim.ChaincodeStubInterface) (User, error) {
	userbytes, err := stub.GetState(key)
	var user User
	if err != nil {
		fmt.Println("could not fetch user", err)
		return user, err
	}

	err = json.Unmarshal(userbytes, &user)
	if err != nil {
		fmt.Println("Unable to marshal data", err)
		return user, err
	}

	return user, nil
}