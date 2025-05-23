import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
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

import { db, type Note } from "../../api/db";

export const NoteModal: React.FC<{
  date: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  eventId: string | number | null;
}> = ({ date, open, setOpen }) => {
  const [note, setNote] = useState<Note>({
    date,
    text: "",
    images: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      db.notes.get(date).then((storedNote) => {
        if (storedNote) {
          setNote(storedNote);
        } else {
          setNote({ date, text: "", images: [] });
        }
        setLoading(false);
      });
    }
  }, [date, open]);

  const saveNote = async (updatedNote: Note) => {
    setNote(updatedNote);
    await db.notes.put(updatedNote);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    for (const file of files) {
      const base64 = await fileToBase64(file);
      const updatedImages = [...note.images, base64];
      await saveNote({ ...note, images: updatedImages });
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const removeImage = async (index: number) => {
    const updatedImages = note.images.filter((_, i) => i !== index);
    await saveNote({ ...note, images: updatedImages });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      scroll="body"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Note for {date}</Typography>
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Typography>Loading note...</Typography>
        ) : (
          <>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Write your note"
              value={note.text}
              onChange={(e) => saveNote({ ...note, text: e.target.value })}
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

            {note.images.length > 0 && (
              <ImageList cols={3} gap={8}>
                {note.images.map((img, idx) => (
                  <ImageListItem key={idx}>
                    <img
                      src={img}
                      alt={`Attachment ${idx + 1}`}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      position="top"
                      actionIcon={
                        <IconButton
                          onClick={() => removeImage(idx)}
                          sx={{ color: "white" }}
                          aria-label="remove"
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
