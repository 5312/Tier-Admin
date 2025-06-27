import type { ResultCode } from "./enum";

export interface Result<T = unknown> {
	code: ResultCode;
	message: string;
	data: T;
}
