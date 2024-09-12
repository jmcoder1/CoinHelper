import { getRandInt } from "./getRandInt";

export const getRandElement = (arr: any[]) => arr[getRandInt(arr.length)];
