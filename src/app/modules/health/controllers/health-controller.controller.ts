import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class HealthControllerController {
  @Get()
  public health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: "UP", version: "0.0.1" });
  }
}
