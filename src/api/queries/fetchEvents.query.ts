import { processServerError } from "../../helpers/processServerError";
import { getClient, graphql, type ResultOf } from "../client";

const fetchEventsQuery = graphql(`
  query fetchEvents {
    event {
      id
      title
      description
      start
      end
      images {
        id
        base_64
        recognized_text
      }
    }
  }
`);

export type IFetchedEvent = ResultOf<typeof fetchEventsQuery>["event"][0];

export const fetchEvents = async () => {
  try {
    const client = await getClient();

    const { data, error } = await client.query(fetchEventsQuery, {});

    if (error) processServerError(error);

    return (
      data?.event.filter(
        (event): event is typeof event & { start: string; end: string } => {
          return !!event.start && !!event.end;
        }
      ) || []
    );
  } catch (e) {
    processServerError(e);
    return [];
  }
};
