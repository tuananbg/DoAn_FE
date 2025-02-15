import { Activity } from './activities';
import { TaskForm } from './task';
import { Opportunities } from './opportunities';

export const contactStatusList: string[] = [
  'Salaried',
  'Commission',
  'Terminated',
];

export type ContactStatus = (typeof contactStatusList)[number];

type State = {
    stateShort: string;
};

export interface ContactBase {
  address: string,
  firstName: string,
  lastName: string,
  position: string,
  manager: string,
  company: string,
  phone: string,
  email: string,
  image: string,
}

export interface Contact {
  id: number,
  employeeCode: string,
  employeeName: string,
  gender: number,
  status: ContactStatus,
  phone: string,
  birthday: any,
  email: string,
  address: string,
  departmentName: string,
  positionName: string,
  departmentId: number,
  positionId: number,
  avatar: string,
  isActive: any,
}

export const newContact: ContactBase = {
  firstName: '',
  lastName: '',
  position: '',
  manager: '',
  company: '',
  phone: '',
  email: '',
  image: '',
  address: '',
}

export const REGEX = {
  MOBILE: /(^[+]?(|0-9)+([0-9]){6,}$)/,
  VN_PHONE_NUMBER: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
  MULTIPLE_EMAIL: /^([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z]{2,}){1,2}(\]?)(\s*,\s*|\s*$))*$/,
  EMAIL: /^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z]{2,}){1,2}$/,
  $NOT_SPECIAL_CHARACTERS: /^[a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴýÝỶỸÝửữựỳỵỷỹ -]{0,1000}$/,
  NOT_SPECIAL_CHARACTERS: /^[a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴýÝỶỸÝửữựỳỵỷỹ -]{0,1000}$/,
  VALIDATE_CODE: /^[a-zA-Z0-9 _-]+$/,
  VALIDATE_CODE_NOT_SPACE: /^[a-zA-Z0-9_]+$/,
  VALIDATE_CODE_NOT_SPACE_AND: /^[a-zA-Z0-9_]+$/,
  VALIDATE_CODE_DEPARTMENT: /^[a-zA-Z&0-9_-]+$/,
  VALIDATE_CODE_DOT: /^[a-zA-Z&0-9.]+$/,
  ONLY_NUMBER: /^[0-9]*$/,
  TEXT_AND_SPACE: /^[A-Za-z\s]+$/,
  YEAR: /^([1][9][0-9][0-9]|[2][0-9][0-9][0-9]|[3][0][0][0])$/,
  CUSTOM_EMAIL: /^[^<>()[\]\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
  ONLY_NUMBER_AND_PLUS: /^[0-9+]*$/,
  CUSTOM_PHONE: /^[+]?[0-9]{0,12}$/,
  PERCENTAGE: /^[1-9](?:,[0-9]){0,2}$|^[1-9]\d(?:,[0-9]\d){0,2}$|^[1-9](?:,[0-9]\d){0,2}$|^[1-9]\d(?:,[0-9]){0,2}$|^[1-9]\d{0,2}(?:,[0-9]\d){0,2}$|^[1-9]\d{0,2}(?:,[0-9]){0,2}$/,
  NUMBER_AND_COMMA: /^[0-9,]+$/,
  LIMIT: /\b([a-zA-Z]){1,2}[0-9]{1,3}\b/
};
