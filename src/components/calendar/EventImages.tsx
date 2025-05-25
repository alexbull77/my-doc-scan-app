import React, { useState } from "react";
import {
  IconButton,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Tesseract from "tesseract.js";
import { processServerError } from "../../helpers/processServerError";

interface ImageType {
  base_64?: string | null;
  recognized_text?: string | null;
  title?: string | null;
}

interface EventImagesProps {
  images: ImageType[];
  setImages: (images: ImageType[]) => void;
}

export const EventImages: React.FC<EventImagesProps> = ({
  images,
  setImages,
}) => {
  const [isRecognizing, setIsRecognizing] = useState(false);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);

      for (const file of files) {
        const base_64 = await fileToBase64(file);
        setIsRecognizing(true);
        const {
          data: { text: ocrText },
        } = await Tesseract.recognize(file, "eng+rus+ron");

        const newImage = {
          base_64,
          recognized_text: ocrText.trim(),
          title: file.name,
        };

        setImages([...images, newImage]);
      }
    } catch (error) {
      processServerError(error);
      return;
    } finally {
      setIsRecognizing(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Handler to update recognized text for a specific image by index
  const handleRecognizedTextChange = (index: number, newText: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      recognized_text: newText,
    };
    setImages(updatedImages);
  };

  return (
    <>
      <Button
        variant="outlined"
        disabled={isRecognizing}
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

      {isRecognizing && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <CircularProgress size={24} />
          <Typography>Recognizing text, please wait...</Typography>
        </Box>
      )}

      {!!images.length && (
        <div>
          {images.map((img, idx) => (
            <div className="flex flex-col gap-y-2" key={idx}>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-lg">{img.title}</div>
                <IconButton onClick={() => removeImage(idx)}>
                  <DeleteIcon />
                </IconButton>
              </div>
              <img src={img.base_64 || ""} alt={`Attachment ${idx + 1}`} />
              <TextField
                multiline
                minRows={3}
                fullWidth
                variant="outlined"
                value={img.recognized_text || ""}
                onChange={(e) =>
                  handleRecognizedTextChange(idx, e.target.value)
                }
                sx={{ mt: 1 }}
                placeholder="Edit recognized text..."
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
