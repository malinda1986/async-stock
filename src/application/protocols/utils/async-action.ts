export interface AsyncAction {
  handle: (params: any) => Promise<void>;
}
