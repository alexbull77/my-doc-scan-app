import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import { CalendarLocale, useCalendarStore } from "../calendarStore";

export const LocaleDropdown = () => {
  const locale = useCalendarStore((state) => state.locale);
  const setLocale = useCalendarStore((state) => state.setLocale);

  const handleChange = (event: SelectChangeEvent<CalendarLocale>) => {
    setLocale(event.target.value as CalendarLocale);
  };

  return (
    <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 2 }}>
      <InputLabel id="locale-select-label">Locale</InputLabel>
      <Select
        labelId="locale-select-label"
        value={locale}
        label="Locale"
        onChange={handleChange}
      >
        <MenuItem value={CalendarLocale.EN}>English</MenuItem>
        <MenuItem value={CalendarLocale.RO}>Romanian</MenuItem>
        <MenuItem value={CalendarLocale.RU}>Russian</MenuItem>
      </Select>
    </FormControl>
  );
};
