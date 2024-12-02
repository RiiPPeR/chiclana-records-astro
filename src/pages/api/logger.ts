import chalk from 'chalk';

export const logger = {
    info: (message: string, data?: any) => {
        //if (import.meta.env.DEV) {
            console.log(
                chalk.blue('[INFO]'), 
                message, 
                data ? chalk.cyan(JSON.stringify(data, null, 2)) : ''
            )
        //}
    },
    warn: (message: string, data?: any) => {
        //if (import.meta.env.DEV) {
            console.log(
                chalk.yellow('[WARN]'), 
                message, 
                data ? chalk.yellow(JSON.stringify(data, null, 2)) : ''
            )
        //}
    },
    error: (message: string, error?: any) => {
        console.error(
            chalk.red('[ERROR]'), 
            message, 
            error ? chalk.red(JSON.stringify(error, null, 2)) : ''
        )
    },
    success: (message: string, data?: any) => {
        //if (import.meta.env.DEV) {
            console.log(
                chalk.green('[SUCCESS]'), 
                message, 
                data ? chalk.green(JSON.stringify(data, null, 2)) : ''
            )
        //}
    }
}
