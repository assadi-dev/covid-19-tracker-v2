import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import "./infobox.css";

function Infobox({ active, title, cases, total, ...props }) {
  return (
    <Card
      className={`infobox ${active && "infobox-selected"}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infobox_title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infobox_cases">{cases}</h2>
        <Typography className="infobox_total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
