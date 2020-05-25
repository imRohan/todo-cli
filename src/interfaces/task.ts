export enum ITaskStatus {
  pending = 'PENDING',
  blocked = 'BLOCKED',
  complete = 'COMPLETE',
  notDoing = 'NOT_DOING',
}

export interface ITask {
  id: string,
  title: string,
  description: string,
  createdAt: any,
  updatedAt: any,
  status: ITaskStatus,
  uuid: string,
}

export interface ITaskSanitized {
  id: string,
  title: string,
  description: string,
  status: string,
  minutesSpent: number,
}
