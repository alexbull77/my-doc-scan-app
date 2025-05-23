export const Scanner = ({ onScan }: { onScan: (img: string) => void }) => {
  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onScan(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">
      📷 Scan Document
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="hidden"
      />
    </label>
  );
};
