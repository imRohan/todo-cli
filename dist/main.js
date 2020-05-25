#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External Deps
const prog = require("caporal");
// External Files
const TasksController = require("./controllers/tasks");
prog.version('1.0.0')
    .command('list', 'print all tasks and their status')
    .action((args, options, logger) => {
    TasksController.listAll(logger);
})
    .command('add', 'add a task')
    .argument('<Id>', 'ID of task')
    .argument('<title>', 'title of task')
    .argument('[description]', 'description of task')
    .action((args, options, logger) => {
    TasksController.add(args, logger);
})
    .command('update', 'update a task')
    .argument('<id>', 'ID of task')
    .argument('<status>', 'status of task', /^pending|blocked|complete|notDoing$/)
    .action((args, options, logger) => {
    TasksController.updateStatus(args, logger);
})
    .command('complete', 'complete a task')
    .argument('<id>', 'ID of task')
    .action((args, options, logger) => {
    TasksController.completeTask(args, logger);
});
prog.parse(process.argv);
