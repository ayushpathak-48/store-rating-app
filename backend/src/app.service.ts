import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello() {
    return {
      message: "Welcome to the Ratings API",
      status: "OK",
      author: "Aayush Pathak",
    };
  }
}
