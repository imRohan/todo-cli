#!/usr/bin/env node

// External Deps
import * as prog from 'caporal'

// External Files
import TasksController = require('./controllers/tasks')

prog.version('1.0.0')
  .command('list', 'print all tasks and their status')
  .action((args, options, logger) => {
    TasksController.listAll(logger)
  })
  .command('add', 'add a task')
  .argument('<ID>', 'ID of task')
  .argument('<title>', 'title of task')
  .argument('[description]', 'description of task')
  .action((args, options, logger) => {
    TasksController.add(args, logger)
  })
  .command('update', 'update a task')
  .argument('<id>', 'ID of task')
  .argument('<status>', 'status of task', /^pending|blocked|complete|notDoing$/)
  .action((args, options, logger) => {
    TasksController.updateStatus(args, logger)
  })
  .command('complete', 'complete a task')
  .action((args, options, logger) => {
    logger.info('complete a task')
  })

prog.parse(process.argv)
