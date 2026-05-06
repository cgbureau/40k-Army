import { Effect, Logger, LogLevel } from "effect";

type LogLevelName = "Fatal" | "Error" | "Warning" | "Info" | "Debug" | "Trace";

type LogEntry = {
	timestamp: string;
	level: string;
	component: string;
	message: string;
} & Record<string, unknown>;

export type LogInfo = {
	component: string;
	message: string;
	level?: LogLevelName;
	context?: Record<string, unknown>;
};

/**
 * Converts any Effect log message value into a stable string for console output.
 *
 * @param message - The raw message value passed to the Effect logger.
 * @returns A string representation suitable for structured log entries.
 */
const formatMessage = (message: unknown): string => {
	if (Array.isArray(message)) {
		return message.map(formatMessage).join(" ");
	}

	if (message instanceof Error) {
		return message.stack ?? message.message;
	}

	if (typeof message === "string") {
		return message;
	}

	if (typeof message === "object" && message !== null) {
		try {
			return JSON.stringify(message);
		} catch {
			return String(message);
		}
	}

	return String(message);
};

/**
 * Copies Effect log annotations into a plain object for structured logging.
 *
 * @param annotations - The annotation entries attached to an Effect log event.
 * @returns A record containing annotation keys and values.
 */
const annotationsToRecord = (
	annotations: Iterable<readonly [string, unknown]>,
): Record<string, unknown> => {
	const record: Record<string, unknown> = {};

	for (const [key, value] of annotations) {
		record[key] = value;
	}

	return record;
};

/**
 * Builds the structured log object written by the custom logger.
 *
 * @param options - The Effect logger options for a single log event.
 * @returns A normalized log entry with timestamp, level, component, message, and context.
 */
const buildLogEntry = ({
	annotations,
	date,
	logLevel,
	message,
}: Logger.Logger.Options<unknown>): LogEntry => {
	const { component: annotatedComponent, ...context } =
		annotationsToRecord(annotations);
	const component =
		typeof annotatedComponent === "string" ? annotatedComponent : "unknown";

	return {
		...context,
		timestamp: date.toISOString(),
		level: logLevel.label,
		component,
		message: formatMessage(message),
	};
};

/**
 * Writes a structured log entry to the console method that matches its level.
 *
 * @param logLevel - The Effect log level for the entry.
 * @param logEntry - The structured log entry to write.
 */
const writeLogEntry = (
	logLevel: LogLevel.LogLevel,
	logEntry: LogEntry,
): void => {
	switch (logLevel) {
		case LogLevel.Fatal:
		case LogLevel.Error:
			console.error(logEntry);
			break;
		case LogLevel.Warning:
			console.warn(logEntry);
			break;
		case LogLevel.Debug:
		case LogLevel.Trace:
			console.debug(logEntry);
			break;
		case LogLevel.Info:
			console.info(logEntry);
			break;
		default:
			console.log(logEntry);
	}
};

/**
 * Effect logger implementation that emits structured records to the console.
 */
export const customLogger = Logger.make<unknown, void>((options) => {
	writeLogEntry(options.logLevel, buildLogEntry(options));
});

/**
 * Creates an Effect log action for the requested level.
 *
 * @param level - The log level to use for the Effect log action.
 * @param message - The message to write.
 * @returns An Effect that logs the message at the requested level.
 */
const logEffectForLevel = (level: LogLevelName, message: string) => {
	switch (level) {
		case "Fatal":
			return Effect.logFatal(message);
		case "Error":
			return Effect.logError(message);
		case "Warning":
			return Effect.logWarning(message);
		case "Debug":
			return Effect.logDebug(message);
		case "Trace":
			return Effect.logTrace(message);
		case "Info":
			return Effect.logInfo(message);
	}
};

export const LoggerLive = Logger.replace(Logger.defaultLogger, customLogger);

/**
 * Creates an annotated Effect log entry with component and contextual metadata.
 *
 * @param logInfo - Message, component, optional level, and optional context for the log entry.
 * @returns An Effect that logs the message with the provided annotations.
 */
export const logWithContext = ({
	component,
	message,
	level = "Info",
	context = {},
}: LogInfo) =>
	logEffectForLevel(level, message).pipe(
		Effect.annotateLogs({
			component,
			...context,
		}),
	);
