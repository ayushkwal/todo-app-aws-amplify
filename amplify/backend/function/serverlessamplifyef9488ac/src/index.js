
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
AWS.config.update({
    region: 'us-east-1'
})

exports.handler = async (event, context) => {
    console.log('...................', event.httpMethod, event.pathParameters)
    switch (event.httpMethod) {
        case "GET":
            return await getData(event);
        case "POST":
            return await createData(event);
        case "PUT":
            return await updateData(event);
        case "DELETE":
            return await deleteData(event);
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Invalid HTTP Method",
                }),
            };
    }
};
//----------------------------------------------------------------------------------->
const getData = async (event) => {
    const params = {
        TableName: "crudoperation-dev"
    };

    try {
        const result = await dynamoDb.scan(params).promise();
        if (!result.Items) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Data not found" }),
            };
        }
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
//----------------------------------------------------------------------------------->
const createData = async (event) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "crudoperation-dev",
        Item: {
            id: data.id,
            name: data.name,
            age: data.age,
            address: data.address,
        },
    };

    try {
        const saver = await dynamoDb.put(params).promise();
        console.log(saver)
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(params.Item),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
//----------------------------------------------------------------------------------->
const updateData = async (event) => {

    const data = JSON.parse(event.body);
    const params = {
        TableName: "crudoperation-dev",
        Key: {
            id: data.id,
        },
        UpdateExpression: "set #name = :newName, age = :a, address = :ad",
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ":newName": data.name,
            ":a": data.age,
            ":ad": data.address,
        },
        ReturnValues: "ALL_NEW",
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(result),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
//----------------------------------------------------------------------------------->
const deleteData = async (event) => {
    console.log('deleting', event.pathParameters)
    const data = JSON.parse(event.body);
    const params = {
        TableName: "crudoperation-dev",
        Key: {
            id: event.pathParameters.proxy
        },
    };

    try {
        await dynamoDb.delete(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ message: "Data deleted successfully" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ error: error.message + 'ssssss' }),
        };
    }
};