// External Deps
import table = require('cli-table')

// External Files
import Task = require('../models/task')

class TasksController {
  public static async listAll(logger) {
    const _tasks = await Task.listAllSanitized()

    const _table = new table({
      head: ['ID', 'Name', 'Description', 'Status', 'Time Spent (min)'],
    })

    for (const _task of _tasks) {
      _table.push(Object.values(_task))
    }
    logger.info(_table.toString())
  }

  public static async add(args, logger) {
    const _newTask = new Task(args)
    await _newTask.store()
    TasksController.listAll(logger)
  }

  public static async updateStatus(args, logger) {
    await Task.updateStatus(args)
    TasksController.listAll(logger)
  }

  public static async completeTask(args, logger) {
    await Task.complete(args)
    TasksController.listAll(logger)
  }
}

export = TasksController
