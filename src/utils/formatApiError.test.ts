import { formatApiError } from "./formatApiError";

describe("formatApiError", () => {
  it("returns Error.message for normal errors", () => {
    expect(formatApiError(new Error("boom"))).toBe("boom");
  });

  it("summarizes axios-like errors without dumping headers", () => {
    const axiosLike = {
      isAxiosError: true,
      message: "Request failed with status code 403",
      config: {
        method: "patch",
        url: "/guilds/123/users/456",
        headers: { Authorization: "secret-token" },
      },
      response: {
        status: 403,
        data: { message: "This application is not authorized" },
      },
    };

    const formatted = formatApiError(axiosLike);
    expect(formatted).toContain("403");
    expect(formatted).toContain("This application is not authorized");
    expect(formatted).toContain("/guilds/123/users/456");
    expect(formatted).not.toContain("secret-token");
    expect(formatted).not.toContain("Authorization");
  });
});
