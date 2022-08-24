"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
require("colors");
var log_old = console.log;
/**
 * Show log file and method called this function in the terminal. Only support node environment.
 * @param ...msg any[]
 * @returns void
 */
function __log() {
    var _a, _b, _c, _d;
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    if (process.env.DEBUG_LOG_DISABLED && !process.env.DEBUG_LOG_REPLACE_CONSOLE)
        return;
    if (typeof window !== 'undefined' && typeof window.document !== undefined)
        return;
    var start = Date.now();
    try {
        throw new Error('Error from __log, skip it if this show wrong');
    }
    catch (err) {
        var stack = err.stack;
        if (!stack)
            return;
        var logRow = stack.split("\n")[2];
        if (!logRow)
            return;
        logRow = logRow.replace(/^.+at /, '').replace(')', '');
        var arrInfo = logRow.split('(');
        var method = arrInfo[0];
        var position = arrInfo[0].split(':');
        if (arrInfo.length === 1) {
            method = '<anonymous>';
        }
        else {
            position = arrInfo[1].split(':');
        }
        if (method.match(/^new /)) {
            method = method.replace('new ', '').trim() + ' :: constructor';
        }
        else if (method.match(/^Function\./)) {
            method = 'static :: ' + method.replace('Function.', '');
        }
        else if (method.match(/^Object.\<anonymous\>/)) {
            method = '';
        }
        else {
            method = method.replace(/\./g, ' :: ');
        }
        position.pop();
        var line = (_a = position.pop()) !== null && _a !== void 0 ? _a : '';
        var min = parseInt((_b = process.env.DEBUG_LOG_MIN_COLUMNS) !== null && _b !== void 0 ? _b : '');
        if (!min || min < 6)
            min = 6;
        if (line.length < min)
            line = '0'.repeat(min - line.length).white + ' ' + line.yellow;
        var rootPath = (_d = (_c = process.env.npm_package_json) === null || _c === void 0 ? void 0 : _c.replace('package.json', '')) !== null && _d !== void 0 ? _d : '';
        var fileName = position.join(':').replace(rootPath, '');
        var msgLog = [
            "".concat((Date.now() - start + 'ms').red, " ") +
                "[ ".concat(line, " :: ").concat(fileName.yellow, " ]") +
                " ".concat(method).green,
        ];
        msg.length && msgLog.push.apply(msgLog, __spreadArray(['👉'], msg, false));
        log_old.apply(void 0, msgLog);
    }
}
global.__log = __log;
process.env.DEBUG_LOG_REPLACE_CONSOLE && (console.log = __log);
