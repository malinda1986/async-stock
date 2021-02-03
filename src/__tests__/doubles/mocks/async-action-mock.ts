import { ActionParams, AsyncAction } from '@/application/protocols';

export class AsyncActionMock implements AsyncAction {
  params: ActionParams;

  async handle(params: ActionParams): Promise<void> {
    this.params = params;
  }
}
