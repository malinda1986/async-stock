import { AsyncAction } from "@/application/protocols";

export class DecrementAction implements AsyncAction {
  async handle(params: any): Promise<void> {
    console.log("Handling decrement", params);
  }
}
