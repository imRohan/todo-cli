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
const table = require("cli-table");
// External Files
const Task = require("../models/task");
class TasksController {
    static listAll(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const _tasks = yield Task.listAllSanitized();
            const _table = new table({
                head: ['ID', 'Name', 'Description', 'Status', 'Time Spent (min)'],
            });
            for (const _task of _tasks) {
                _table.push(Object.values(_task));
            }
            logger.info(_table.toString());
        });
    }
    static add(args, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const _newTask = new Task(args);
            yield _newTask.store();
            TasksController.listAll(logger);
        });
    }
    static updateStatus(args, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Task.updateStatus(args);
            TasksController.listAll(logger);
        });
    }
    static completeTask(args, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Task.complete(args);
            TasksController.listAll(logger);
        });
    }
}
module.exports = TasksController;
