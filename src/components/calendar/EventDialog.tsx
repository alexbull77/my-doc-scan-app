import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import {
  createEvent,
  type IInsertEvent,
} from "../../api/mutations/createEvent.mutation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { eventsQueryOptions } from "../../eventQueryOptions";
import { DateTimePicker } from "@mui/x-date-pickers";
import { getRoundedStartEnd } from "../../helpers/getRoundedStartEnd";
import { useForm, Controller } from "react-hook-form";
import { updateEvent } from "../../api/mutations/updateEvent.mutation";
import { useCalendarStore } from "../../calendarStore";

import { EventImages } from "./EventImages"; // import the new component
import { useUser } from "@clerk/clerk-react";

export const EventDialog = () => {
  const { selectedDate, open, setOpen, selectedEvent } = useCalendarStore();
  const { start, end } = getRoundedStartEnd(selectedDate);
  const { user } = useUser();

  const { control, register, handleSubmit, reset, setValue } =
    useForm<IInsertEvent>({
      defaultValues: {
        title: "",
        description: "",
        start,
        end,
        images: { data: [] },
        user_id: user?.id,
      },
    });

  useEffect(() => {
    if (!user) return;
    setValue("user_id", user?.id);
  }, [user, user?.id, setValue]);

  useEffect(() => {
    if (selectedEvent) {
      reset({
        ...selectedEvent,
        user_id: user?.id,
      });
    } else {
      reset({
        title: "",
        description: "",
        start,
        end,
        images: { data: [] },
        user_id: user?.id,
      });
    }
  }, [selectedEvent, reset, open, user?.id]);

  const { mutate: handleCreateEvent, isPending: createPending } = useMutation({
    mutationKey: eventsQueryOptions.all,
    mutationFn: createEvent,
    onSuccess: (id) => {
      if (!id) return;
      toast.success("Event created");
      reset();
      setOpen(false);
    },
  });

  const { mutate: handleUpdateEvent, isPending: updatePending } = useMutation({
    mutationKey: eventsQueryOptions.all,
    mutationFn: updateEvent,
    onSuccess: (id) => {
      if (!id) return;
      toast.success("Event updated");
      reset();
      setOpen(false);
    },
  });

  const isPending = createPending || updatePending;

  const isEdit = selectedEvent?.id;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const onSubmit = (data: IInsertEvent) => {
    if (selectedEvent?.id) {
      const { images, ...rest } = data;
      handleUpdateEvent({
        id: selectedEvent.id,
        event: rest,
        images:
          images?.data.map((i) => ({ ...i, event_id: selectedEvent.id })) || [],
      });
    } else {
      handleCreateEvent(data);
    }
  };

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      onClose={() => {
        if (!isPending) {
          setOpen(false);
        }
      }}
      fullWidth
      maxWidth="sm"
      scroll="body"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          height: isMobile ? "100dvh" : "80dvh",
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isEdit ? "Edit event" : "New event"}
          <IconButton
            aria-label="close"
            onClick={() => {
              if (!isPending) setOpen(false);
            }}
            edge="end"
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="flex flex-col gap-y-2">
          <input type="hidden" {...register("user_id")} />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Title"
            {...register("title")}
            variant="outlined"
            margin="normal"
          />

          <Controller
            control={control}
            name="start"
            render={({ field }) => (
              <DateTimePicker
                label="Start Date & Time"
                value={dayjs(field.value)}
                onChange={(date) =>
                  field.onChange(date?.format("YYYY-MM-DD HH:mm"))
                }
                format="YYYY-MM-DD HH:mm"
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            )}
          />

          <Controller
            control={control}
            name="end"
            render={({ field }) => (
              <DateTimePicker
                label="End Date & Time"
                value={dayjs(field.value)}
                onChange={(date) =>
                  field.onChange(date?.format("YYYY-MM-DD HH:mm"))
                }
                format="YYYY-MM-DD HH:mm"
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            )}
          />

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description"
            {...register("description")}
            variant="outlined"
            margin="normal"
          />

          <Controller
            control={control}
            name="images"
            defaultValue={{ data: [] }}
            render={({ field }) => {
              // field.value should be { data: ImageType[] }
              const imagesArray = field.value?.data || [];

              // wrapper to keep structure { data: [...] }
              const setImagesWrapper = (imgs: typeof imagesArray) => {
                field.onChange({ data: imgs });
              };

              return (
                <EventImages
                  images={imagesArray}
                  setImages={setImagesWrapper}
                />
              );
            }}
          />
        </DialogContent>

        <DialogActions sx={{ paddingY: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
          >
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
