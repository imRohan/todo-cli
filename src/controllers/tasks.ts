// Interfaces
//import { ITask } from '../interfaces/task'

// External Files
import Task = require('../models/task')

class TasksController {
  public static async listAll(logger) {
    logger.info('print all tasks')
    const _tasks = await Task.listAll()
    logger.info(_tasks)
  }

  public static async add(args, logger) {
    logger.info(`Adding task ${JSON.stringify(args)}`)
    const _newTask = new Task(args)
    await _newTask.store()
  }

  public static async updateStatus(args, logger) {
    logger.info(`Update task ${args}`)
    await Task.updateStatus(args)
  }

  public static completeTask(args, logger) {
    logger.info(`Complete task ${args}`)
  }
}

export = TasksController
