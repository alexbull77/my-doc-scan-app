import React, { useState } from "react";
import {
  IconButton,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createWorker } from "tesseract.js";
import { processServerError } from "../../helpers/processServerError";
import { compressImage } from "../../helpers/compressImage";

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
  const [progress, setProgress] = useState(0);

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
      setIsRecognizing(true);

      const worker = await createWorker(["eng", "rus", "ron"], undefined, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      for (const file of files) {
        setProgress(0);

        const compressed = await compressImage(file);
        const base_64 = await fileToBase64(compressed);

        const {
          data: { text: ocrText },
        } = await worker.recognize(compressed);

        const newImage = {
          base_64,
          recognized_text: ocrText.trim(),
          title: file.name,
        };

        setImages([...images, newImage]);
      }

      await worker.terminate();
    } catch (error) {
      processServerError(error);
    } finally {
      setIsRecognizing(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

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
      {!!images.length && (
        <div className="flex flex-col gap-y-4">
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
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Recognizing text: {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </>
  );
};
