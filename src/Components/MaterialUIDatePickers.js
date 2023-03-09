import * as React from "react";
import Stack from "@mui/material/Stack";
import { TextField } from "@material-ui/core";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function MaterialUIDatePickers(props) {
  const { value, handleDateChange, label, currentDate, minDate } = props;
  console.log("props", props);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label={label}
          inputFormat="MM/DD/YYYY"
          value={value}
          minDate={value ? currentDate : value}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField fullWidth required size="small" {...params} />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}
