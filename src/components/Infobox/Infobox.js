import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

function Infobox({ title, cases, total }) {
  return (
    <Card>
      <h2>Infobox</h2>
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
