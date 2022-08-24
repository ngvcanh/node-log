import 'colors';
declare global{
  function __log(...msg: any[]): void; 
}

const log_old = console.log;

/**
 * Show log file and method called this function in the terminal. Only support node environment.
 * @param ...msg any[]
 * @returns void
 */
function __log(...msg: any[]){
  if (process.env.DEBUG_LOG_DISABLED && !process.env.DEBUG_LOG_REPLACE_CONSOLE) return;
  if (typeof window !== 'undefined' && typeof window.document !== undefined) return;

  const start = Date.now();

  try{
    throw new Error('Error from __log, skip it if this show wrong');
  }
  catch(err){
    const stack = (err as Error).stack;
    if (!stack) return;

    let logRow = stack.split("\n")[2];
    if (!logRow) return;

    logRow = logRow.replace(/^.+at /, '').replace(')', '');
    const arrInfo = logRow.split('(');

    let method = arrInfo[0];
    let position = arrInfo[0].split(':');

    if (arrInfo.length === 1){
      method = '<anonymous>';
    }
    else{
      position = arrInfo[1].split(':');
    }
  
    if (method.match(/^new /)){
      method = method.replace('new ', '').trim() + ' :: constructor';
    }
    else if (method.match(/^Function\./)){
      method = 'static :: ' + method.replace('Function.', '');
    }
    else if (method.match(/^Object.\<anonymous\>/)){
      method = '';
    }
    else{
      method = method.replace(/\./g, ' :: ');
    }

    position.pop();

    let line = position.pop() ?? '';
    let min = parseInt(process.env.DEBUG_LOG_MIN_COLUMNS ?? '');

    if (!min || min < 6) min = 6;
    if (line.length < min) line = '0'.repeat(min - line.length).white + ' ' + line.yellow;

    const rootPath = process.env.npm_package_json?.replace('package.json', '') ?? '';
    const fileName = position.join(':').replace(rootPath, '');

    const msgLog = [
      `${ (Date.now() - start + 'ms').red } ` + 
      `[ ${ line } :: ${ fileName.yellow } ]` +
      ` ${ method }`.green,
    ];

    msg.length && msgLog.push('👉', ...msg);
    log_old(...msgLog);
  }
}

global.__log = __log;
process.env.DEBUG_LOG_REPLACE_CONSOLE && (console.log = __log);