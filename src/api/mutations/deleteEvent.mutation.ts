import { processServerError } from "../../helpers/processServerError";
import { getClient, graphql } from "../client";

const deleteEventMutation = graphql(`
  mutation deleteEvent($id: uuid!) {
    delete_event_by_pk(id: $id) {
      id
    }
  }
`);

export const deleteEvent = async (id: string) => {
  try {
    const client = await getClient();

    const { data, error } = await client.mutation(deleteEventMutation, {
      id,
    });

    if (error) processServerError(error);

    return data?.delete_event_by_pk?.id;
  } catch (e) {
    processServerError(e);
    return;
  }
};
