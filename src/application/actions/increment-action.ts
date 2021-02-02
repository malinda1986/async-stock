import { AsyncAction } from "@/application/protocols";

export class IncrementAction implements AsyncAction {
  async handle(params: any): Promise<void> {
    console.log("Handling increment", params);
  }
}
