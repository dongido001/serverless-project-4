import DynamodbService from "../services/Dynamo"

export interface TodoItem {
    userId: string
    todoId: string
    createdAt: string
    name: string
    dueDate: string
    done: boolean
    attachmentUrl?: string
}

export interface TodoUpdate {
    name: string
    dueDate: string
    done: boolean
}

export default class Todo {
    private db: any

    constructor() {
        this.db = new DynamodbService()
    }

    async getTodosByUserId(userId: string) {
        return await this.db.getItemsByKey("userId", userId)
    }

    async updateTodo(todoId: string, item: TodoUpdate, userId?: string) {
        return await this.db.updateItem(todoId, item, userId)
    }

    async deleteTodo(todoId: string, userId?: string) {
        return await this.db.deleteItem(todoId, userId)
    }

    async createTodo(item: TodoItem) {
        return await this.db.putItem(item)
    }

    async updateTodoAttachmentUrl(todoId, attachmentUrl, userId) {
        return await this.db.updateAttachmentUrl(todoId, attachmentUrl, userId)
    }
}