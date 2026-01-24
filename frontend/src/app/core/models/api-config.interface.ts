export interface ServiceConfig {
  baseUrl: string;
  version: string;
}

export interface ApiEnvironment {
  services: Record<string, ServiceConfig>;
  routes: Record<string, string>;
}
