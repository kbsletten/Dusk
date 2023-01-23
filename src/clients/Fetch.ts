export type Fetch = (
  url: string,
  options?: { method?: string; headers?: Record<string, string>; body?: any }
) => Promise<{
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  text: () => Promise<string>;
  json: () => Promise<any>;
}>;
