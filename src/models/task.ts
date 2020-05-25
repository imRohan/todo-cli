// External Deps
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Interfaces
import { ITask, ITaskSanitized, ITaskStatus } from '../interfaces/task'

class Task {
  public static async listAllSanitized(): Promise<ITaskSanitized[]> {
    try {
      const _tasks = await Task.listAll()
      const _tasksSanitized = _tasks.map((task) => {
        const { id, title, description, status, createdAt, updatedAt } = task
        const _minSpent = (new Date(updatedAt).getTime() - new Date(createdAt).getTime()) / 60000
        const _taskSanitized: ITaskSanitized = {
          id,
          title,
          description,
          status,
          minutesSpent: Math.round(_minSpent),
        }
        return _taskSanitized
      })

      return _tasksSanitized
    } catch (error) {
      throw new Error(`Could not get all tasks: ${error.message}`)
    }
  }

  public static async listAll(): Promise<ITask[]> {
    try {
      await fs.stat(Task.dataFile)
    } catch (error) {
      const _emptyTasks = { tasks: [] }
      await fs.writeFile(Task.dataFile, JSON.stringify(_emptyTasks, null, 4))
    }

    try {
      const _rawData = await fs.readFile(Task.dataFile, 'utf-8')
      const { tasks } = JSON.parse(_rawData.toString())
      const _tasks: ITask[] = tasks
      return _tasks
    } catch (error) {
      throw new Error(`Could not get all tasks: ${error.message}`)
    }
  }

  public static async find(id: string): Promise<Task> {
    try {
      const _tasks = await Task.listAll()
      const [ _task  ] = _tasks.filter((task) => task.id === id)

      if (!_task) { throw new Error(`${id} not found`) }

      const _taskObject = new Task(_task)
      return _taskObject
    } catch (error) {
      throw new Error(`Could not find task: ${error.message}`)
    }
  }

  public static async complete({ id}): Promise<void> {
    try {
      const _task = await Task.find(id)
      _task.status = ITaskStatus.complete
      await _task.store()
    } catch (error) {
      throw new Error(`Could not complete task: ${error.message}`)
    }
  }

  public static async updateStatus({ id, status }): Promise<void> {
    try {
      const _task = await Task.find(id)
      _task.status = ITaskStatus[status]
      await _task.store()
    } catch (error) {
      throw new Error(`Could not update task: ${error.message}`)
    }
  }

  // Constants
  private static readonly dataFile = './dist/tasks.json'

  public id: string
  public title: string
  public description: string
  public status: ITaskStatus
  private createdAt: any
  private updatedAt: any
  private uuid: string

  constructor(params: ITask) {
    const { id, title, description, status, createdAt, uuid } = params
    this.id = id
    this.title = title
    this.description = description ?? 'N/A'
    this.status = status ?? ITaskStatus.pending
    this.createdAt = createdAt ?? new Date()
    this.updatedAt = new Date()
    this.uuid = uuid ?? uuidv4()
  }

  public async store() {
    try {
      const _taskObject = this.formatTask()

      const _existingTasks = await this.getExistingTasks()
      const _newTasks = {
        tasks: [..._existingTasks, _taskObject],
      }

      await fs.writeFile(Task.dataFile, JSON.stringify(_newTasks, null, 4))
    } catch (error) {
      throw new Error(`Could not save task: ${error.message}`)
    }
  }

  private formatTask() {
    const _task: ITask = {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      uuid: this.uuid,
    }

    return _task
  }

  private async getExistingTasks() {
    const _existingTasks = await Task.listAll()
    const _allExceptCurrent: ITask[] = _existingTasks.filter((task) => {
      return task.uuid !== this.uuid
    })
    return _allExceptCurrent
  }
}

export = Task
