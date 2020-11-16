import { globalShortcut } from "electron";
import {Function} from "./globals"
export default function isWritten(func: Function): boolean {
    return func.written == undefined || func.written == true;
}
