"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// External Deps
const fs_1 = require("fs");
const uuid_1 = require("uuid");
// Interfaces
const task_1 = require("../interfaces/task");
class Task {
    constructor(params) {
        const { id, title, description, status, createdAt, uuid } = params;
        this.id = id;
        this.title = title;
        this.description = (description !== null && description !== void 0 ? description : 'N/A');
        this.status = (status !== null && status !== void 0 ? status : task_1.ITaskStatus.pending);
        this.createdAt = (createdAt !== null && createdAt !== void 0 ? createdAt : new Date());
        this.updatedAt = new Date();
        this.uuid = (uuid !== null && uuid !== void 0 ? uuid : uuid_1.v4());
    }
    static listAllSanitized() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _tasks = yield Task.listAll();
                const _tasksSanitized = _tasks.map((task) => {
                    const { id, title, description, status, createdAt, updatedAt } = task;
                    const _minSpent = (new Date(updatedAt).getTime() - new Date(createdAt).getTime()) / 60000;
                    const _taskSanitized = {
                        id,
                        title,
                        description,
                        status,
                        minutesSpent: Math.round(_minSpent),
                    };
                    return _taskSanitized;
                });
                return _tasksSanitized;
            }
            catch (error) {
                throw new Error(`Could not get all tasks: ${error.message}`);
            }
        });
    }
    static listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.promises.stat(Task.dataFile);
            }
            catch (error) {
                const _emptyTasks = { tasks: [] };
                yield fs_1.promises.writeFile(Task.dataFile, JSON.stringify(_emptyTasks, null, 4));
            }
            try {
                const _rawData = yield fs_1.promises.readFile(Task.dataFile, 'utf-8');
                const { tasks } = JSON.parse(_rawData.toString());
                const _tasks = tasks;
                return _tasks;
            }
            catch (error) {
                throw new Error(`Could not get all tasks: ${error.message}`);
            }
        });
    }
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _tasks = yield Task.listAll();
                const [_task] = _tasks.filter((task) => task.id === id);
                if (!_task) {
                    throw new Error(`${id} not found`);
                }
                const _taskObject = new Task(_task);
                return _taskObject;
            }
            catch (error) {
                throw new Error(`Could not find task: ${error.message}`);
            }
        });
    }
    static complete({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _task = yield Task.find(id);
                _task.status = task_1.ITaskStatus.complete;
                yield _task.store();
            }
            catch (error) {
                throw new Error(`Could not complete task: ${error.message}`);
            }
        });
    }
    static updateStatus({ id, status }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _task = yield Task.find(id);
                _task.status = task_1.ITaskStatus[status];
                yield _task.store();
            }
            catch (error) {
                throw new Error(`Could not update task: ${error.message}`);
            }
        });
    }
    store() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _taskObject = this.formatTask();
                const _existingTasks = yield this.getExistingTasks();
                const _newTasks = {
                    tasks: [..._existingTasks, _taskObject],
                };
                yield fs_1.promises.writeFile(Task.dataFile, JSON.stringify(_newTasks, null, 4));
            }
            catch (error) {
                throw new Error(`Could not save task: ${error.message}`);
            }
        });
    }
    formatTask() {
        const _task = {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            uuid: this.uuid,
        };
        return _task;
    }
    getExistingTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const _existingTasks = yield Task.listAll();
            const _allExceptCurrent = _existingTasks.filter((task) => {
                return task.uuid !== this.uuid;
            });
            return _allExceptCurrent;
        });
    }
}
// Constants
Task.dataFile = './dist/tasks.json';
module.exports = Task;
