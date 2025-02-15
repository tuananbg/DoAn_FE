import { Activity } from './activities';
import { Notes } from './notes';
import { Messages } from './messages';

export const taskStatusList: string[] = [
  'Mới',
  'Đang xử lý',
  'Review',
  'Reopen',
  'Hoàn thành',
];

export const taskPriorityList: string[] = [
  'Low',
  'Normal',
  'High',
];

export type TaskPriority = (typeof taskPriorityList)[number];

export type TaskStatus = (typeof taskStatusList)[number];

export type TaskForm = {
  id: number,
  taskCode: string,
  taskName: string,
  taskDescription: string,
  taskStatus: number,
  taskStatusName: string,
  startDay: any,
  endDay: any,
  projectId: number,
  projectName: number,
  followId: number,
  priority: any, //độ uu tiên
};


