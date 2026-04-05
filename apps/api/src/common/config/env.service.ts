import { Injectable } from "@nestjs/common";

import { readEnv, type Environment } from "./env";

@Injectable()
export class EnvService {
  readonly values: Environment = readEnv();
}
