import colors from "colors";

export enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Fatal,
    Off,
}

export class Logger {
    private static _minLevel: LogLevel = LogLevel.Debug;

    public static setLevel(logLevel: LogLevel): void {
        Logger._minLevel = logLevel;
    }

    public static info(message: string): void {
        Logger.log(LogLevel.Info, message);
    }

    public static warning(message: string): void {
        Logger.log(LogLevel.Warning, message);
    }

    public static error(message: string): void {
        Logger.log(LogLevel.Error, message);
    }

    public static debug(message: string): void {
        Logger.log(LogLevel.Debug, message);
    }

    public static fatal(message: string): void {
        Logger.log(LogLevel.Fatal, message);
    }

    private static log(logLevel: LogLevel, message: string): void {
        if (logLevel < Logger._minLevel) {
            console.log('return');
            return;
        }

        const timestamp = new Date().toISOString();
        const prefix = logLevelToString(logLevel);
        //const logMessage = `${timestamp} ${prefix}: ${message}`;
        const logMessage = `${prefix}: ${message}`;

        switch (logLevel) {
            case LogLevel.Debug:
                console.log(colors.dim(logMessage));
                break;
            case LogLevel.Info:
                console.log(colors.cyan(logMessage));
                break;
            case LogLevel.Warning:
                console.log(colors.yellow(logMessage));
                break;
            case LogLevel.Error:
                console.log(colors.red(logMessage));
                break;
            case LogLevel.Fatal:
                console.log(colors.bgRed.white(logMessage));
                break;
            case LogLevel.Off:
                break;
        }
    }
}

function logLevelToString(logLevel: LogLevel): string {
    switch (logLevel) {
        case LogLevel.Info:
            return "INFO";
        case LogLevel.Debug:
            return "DEBUG";
        case LogLevel.Warning:
            return "WARNING";
        case LogLevel.Error:
            return "ERROR";
        case LogLevel.Fatal:
            return "FATAL";
        case LogLevel.Off:
            return "OFF";
        default:
            throw new Error("unknown log level");
    }
}
