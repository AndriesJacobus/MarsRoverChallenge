import React, { Suspense, useEffect, useRef } from 'react';
// import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function RoverControlls(props) {
   const style = {
     position: 'absolute',
     top: '50%',
     right: '1%',
     transform: 'translate(-1%, -50%)',
     width: 400,
     bgcolor: 'background.paper',
     borderRadius: 5,
     padding: 2,
     border: "none",
     maxHeight: '50vh',
     overflow: "auto",
   };

   return (
      <div>
         <Box sx={style}>
            <Typography
               id={"modal-title"}
               variant={"h6"}
               component={"h2"}
               style = {{
                  color: "#fcc4a1",
                  fontWeight: "bold",
                  textAlign: "center"
               }}
               >
               Rover Details
            </Typography>
            <Typography
               style = {{
                  color: "grey",
                  fontSize: 14,
               }}>
               Given Input:<br/>
            </Typography>
            <div style = {{
               whiteSpace: "pre",
               backgroundColor: "black",
               color: "white",
               padding: 5,
            }}>
               {props.input}
            </div>
         
            <Typography
               style = {{
                  color: "grey",
                  fontSize: 14,
                  marginTop: 10,
               }}>
               Calculated Output:<br/>
            </Typography>
            <pre
               style = {{
                  whiteSpace: "pre",
                  backgroundColor: "black",
                  color: "white",
                  padding: 5,
               }}>
               {props.output}
            </pre>
            <Typography
               id={"modal-title"}
               variant={"h6"}
               component={"h2"}
               style = {{
                  color: "#fcc4a1",
                  fontWeight: "bold",
                  textAlign: "center"
               }}
               >
               Controls
            </Typography>
            <Button
               onClick={() => {
                  props.recenterCam();
               }}
               variant={"outlined"}
               color={"success"}
               style = {{
                  marginTop: 20,
               }}
               >
               Recenter
            </Button>
         </Box>
      </div>
   );
}