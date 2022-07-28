import { PutItemOutput } from "aws-sdk/clients/dynamodb"
import XWS from "../helpers/Xws"
import { TodoItem } from '../models/Todo'

export default class Dynamodb {
    _dynamo: AWS.DynamoDB.DocumentClient
    _tableName: undefined | string

    constructor(tableName: string = process.env.TODOS_TABLE) {
        this._tableName = tableName
        this._dynamo = new XWS.DynamoDB.DocumentClient()
    }

    putItem(payload): Promise<PutItemOutput> | void {
        if (this._tableName && payload) {
            return this._dynamo.put({ TableName: this._tableName, Item: payload }).promise()
        } else {
            return new Promise(() => ({}))
        }
    }

    getItem(payload): Promise<any> {
        return this._dynamo.get({
            TableName: this._tableName,
            Key: payload
        }).promise()
    }

    getItems(params: object) {
        console.log({
            TableName: this._tableName,
            ...params
        })

        return this._dynamo.query({
            TableName: this._tableName,
            ...params
        }).promise()
    }

    getItemsByKey(key: string, value: any) {
        const params = {
            ExpressionAttributeValues: {
                ":v1": value
            },
            KeyConditionExpression: `${key} = :v1`,
        }

        return this._dynamo.query({
            TableName: this._tableName,
            ...params
        }).promise()
    }

    updateItem(key: string, item: TodoItem, userId?: string) {
        if (!key || !item) return new Promise(() => ({}))

        const Key = { "todoId": key }
        const ExpressionAttributeNames = {
            "#N": "name",
            "#D": "dueDate",
            "#DD": "done"
        }
        const ExpressionAttributeValues = {
            ":n": item.name,
            ":d": item.name,
            ":dd": item.name,
        }
        let UpdateExpression = "SET #N = :n, #D = :d, #DD = :dd"

        if (userId) Key["userId"] = userId

        const params = {
            TableName: this._tableName,
            Key,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            UpdateExpression
        };

        return this._dynamo.update(params).promise()
    }

    updateAttachmentUrl(key: string, value: any, userId) {
        const params = {
            TableName: this._tableName,
            Key: { "todoId": key, userId },
            ExpressionAttributeNames: { "#N": "attachmentUrl" },
            ExpressionAttributeValues: { ":n": value },
            UpdateExpression: "SET #N = :n"
        };

        return this._dynamo.update(params).promise()
    }

    deleteItem(key: string, userId?: string) {
        const Key = { todoId: key }

        if (userId) Key["userId"] = userId
        
        return this._dynamo.delete({
            TableName: this._tableName,
            Key

        }).promise()
    }
}

