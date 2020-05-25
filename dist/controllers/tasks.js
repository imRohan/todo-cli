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
// Interfaces
const task_1 = require("../interfaces/task");
class TasksController {
    static listAllInFlight(logger) {
        TasksController.listAll(logger, false);
    }
    static listAll(logger, showAll = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let _tasks = yield Task.listAllSanitized();
            if (!showAll) {
                _tasks = _tasks.filter((task) => {
                    const { status } = task;
                    return status === task_1.ITaskStatus.pending ||
                        status === task_1.ITaskStatus.blocked ||
                        status === task_1.ITaskStatus.inProgress;
                });
            }
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
            TasksController.listAllInFlight(logger);
        });
    }
    static updateStatus(args, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Task.updateStatus(args);
            TasksController.listAllInFlight(logger);
        });
    }
    static startTask(args, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Task.start(args);
            TasksController.listAllInFlight(logger);
        });
    }
    static completeTask(args, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Task.complete(args);
            TasksController.listAllInFlight(logger);
        });
    }
}
module.exports = TasksController;
