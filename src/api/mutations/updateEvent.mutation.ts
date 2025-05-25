import { processServerError } from "../../helpers/processServerError";
import { getClient, graphql, type VariablesOf } from "../client";

const updateEventMutation = graphql(`
  mutation updateEvent(
    $id: uuid!
    $event: event_set_input!
    $images: [images_insert_input!]!
  ) {
    update_event_by_pk(pk_columns: { id: $id }, _set: $event) {
      id
    }
    delete_images(where: { event_id: { _eq: $id } }) {
      affected_rows
    }
    insert_images(objects: $images) {
      affected_rows
    }
  }
`);

export type IUpdateEvent = {
  id: string;
  event: VariablesOf<typeof updateEventMutation>["event"];
  images: VariablesOf<typeof updateEventMutation>["images"];
};

export const updateEvent = async ({ id, event, images }: IUpdateEvent) => {
  try {
    const client = await getClient();

    const { data, error } = await client.mutation(updateEventMutation, {
      id,
      event,
      images,
    });

    if (error) processServerError(error);

    return data?.update_event_by_pk?.id;
  } catch (e) {
    processServerError(e);
    return;
  }
};
