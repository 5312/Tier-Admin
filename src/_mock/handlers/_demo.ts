import { DemoApi } from "@/api/services/demoService";
import { ResultCode } from "@/types/enum";
import { http, HttpResponse } from "msw";

const mockTokenExpired = http.post(`/api${DemoApi.TOKEN_EXPIRED}`, () => {
	return new HttpResponse(null, { status: ResultCode.TIMEOUT });
});

export { mockTokenExpired };
