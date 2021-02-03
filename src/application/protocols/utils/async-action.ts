export type ActionParams = { data: string };

export interface AsyncAction {
  handle: (params: ActionParams) => Promise<void>;
}
