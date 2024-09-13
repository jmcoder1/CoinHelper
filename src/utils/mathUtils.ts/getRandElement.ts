import { getRandInt } from "./getRandInt";

// TODO: fix type
export const getRandElement = (arr: any[]) => arr[getRandInt(arr.length)];
