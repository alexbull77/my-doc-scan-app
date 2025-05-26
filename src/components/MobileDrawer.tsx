import { useState } from "react";
import { Drawer, IconButton, List, ListItem, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { LocaleDropdown } from "./LocaleDropdown";

export const MobileDrawer = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
        <MenuIcon className="text-[#6750a4]" />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <LocaleDropdown />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
