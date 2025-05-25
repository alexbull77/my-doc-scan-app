import { processServerError } from "../../helpers/processServerError";
import { getClient, graphql, type VariablesOf } from "../client";

const createEventMutation = graphql(`
  mutation createEvent($event: event_insert_input!) {
    insert_event_one(object: $event) {
      id
    }
  }
`);

export type IInsertEvent = VariablesOf<typeof createEventMutation>["event"];

export const createEvent = async (event: IInsertEvent) => {
  try {
    const client = await getClient();

    const { data, error } = await client.mutation(createEventMutation, {
      event,
    });

    if (error) processServerError(error);

    return data?.insert_event_one?.id;
  } catch (e) {
    processServerError(e);
    return;
  }
};
