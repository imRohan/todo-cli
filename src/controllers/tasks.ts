// External Deps
import table = require('cli-table')

// External Files
import Task = require('../models/task')

// Interfaces
import { ITaskStatus } from '../interfaces/task'

class TasksController {
  public static listAllInFlight(logger) {
    TasksController.listAll(logger, false)
  }

  public static async listAll(logger, showAll = true) {
    let _tasks = await Task.listAllSanitized()

    if (!showAll) {
      _tasks = _tasks.filter((task) => {
        const { status } = task
        return status === ITaskStatus.pending ||
          status === ITaskStatus.blocked ||
          status === ITaskStatus.inProgress
      })
    }

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
    TasksController.listAllInFlight(logger)
  }

  public static async updateStatus(args, logger) {
    await Task.updateStatus(args)
    TasksController.listAllInFlight(logger)
  }

  public static async startTask(args, logger) {
    await Task.start(args)
    TasksController.listAllInFlight(logger)
  }

  public static async completeTask(args, logger) {
    await Task.complete(args)
    TasksController.listAllInFlight(logger)
  }
}

export = TasksController
