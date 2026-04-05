import { Injectable } from "@nestjs/common";

import { readEnv, type Environment } from "./env";

@Injectable()
export class EnvService {
  readonly values: Environment = readEnv();

  get<K extends keyof Environment>(key: K): Environment[K] {
    return this.values[key];
  }
}
