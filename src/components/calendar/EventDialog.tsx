import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import dayjs from "dayjs";
import Tesseract from "tesseract.js";
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

export const EventDialog = () => {
  const { selectedDate, open, setOpen, selectedEvent } = useCalendarStore();
  const { start, end } = getRoundedStartEnd(selectedDate);

  const { control, register, handleSubmit, setValue, watch, reset } =
    useForm<IInsertEvent>({
      defaultValues: {
        title: "",
        description: "",
        start,
        end,
        images: { data: [] },
      },
    });

  useEffect(() => {
    if (selectedEvent) {
      reset(selectedEvent);
    } else {
      reset({
        title: "",
        description: "",
        start,
        end,
        images: { data: [] },
      });
    }
  }, [selectedEvent, reset, open]);

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

  const images = watch("images.data");

  const isPending = createPending || updatePending;

  const isEdit = selectedEvent?.id;

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    for (const file of files) {
      const base_64 = await fileToBase64(file);
      const {
        data: { text: ocrText },
      } = await Tesseract.recognize(file, "eng+rus+ron");

      const newImage = {
        base_64,
        recognized_text: ocrText.trim(),
      };

      setValue("images", {
        data: [...(images || []), newImage],
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const removeImage = (index: number) => {
    const updatedImages = images?.filter((_, i) => i !== index) || [];
    setValue("images", { data: updatedImages });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isPending) {
          setOpen(false);
        }
      }}
      fullWidth
      maxWidth="sm"
      scroll="body"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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

          <Button
            variant="outlined"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
            sx={{ mb: 2 }}
          >
            Attach Photos
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {!!images?.length && (
            <ImageList cols={3} gap={8}>
              {images.map((img, idx) => (
                <ImageListItem key={idx}>
                  <img src={img.base_64 || ""} alt={`Attachment ${idx + 1}`} />
                  <ImageListItemBar
                    position="top"
                    actionIcon={
                      <IconButton
                        onClick={() => removeImage(idx)}
                        sx={{ color: "white" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                  {img.recognized_text && (
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, display: "block", whiteSpace: "pre-wrap" }}
                    >
                      {img.recognized_text}
                    </Typography>
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          )}
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
