import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      let message = err?.response?.message || "Unauthorized access";

      // If token is missing
      if (info?.message === "No auth token") {
        message = "Authentication token is missing";
      }
      // If token is expired
      else if (info?.message === "jwt expired") {
        message = "Your session has expired, please login again";
      }
      // If token is invalid
      else if (
        info?.message === "invalid token" ||
        info?.message === "invalid signature"
      ) {
        message = "Invalid token, please login again";
      }
      // If token format is wrong
      else if (info?.message === "jwt malformed") {
        message = "Malformed token, please login again";
      }

      throw new UnauthorizedException({
        success: false,
        statusCode: 401,
        error: "Unauthorized",
        message,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
