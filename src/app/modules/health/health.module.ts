import { Module } from "@nestjs/common";
import { HealthControllerController } from "./controllers/health-controller.controller";

@Module({
  controllers: [HealthControllerController],
})
export class HealthModule {}
