import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

export default function RoverConfigModal (props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const [input, setInput] = useState("");

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 5,
    padding: 2,
    border: "none",
    maxHeight: '90vh',
    overflow: "auto",
  };
  
  useEffect(() => {
    if (props.setModalOpen) {
      props.setModalOpen.current = setModalOpen;
    }
  }, []);

  async function calculateOutput () {
    await fetch('/calculate_movement_output', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': props.authToken,
      },
      body: JSON.stringify({
        input: input,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Response: ", data);
      if (data.status == "ok") {
        setModalOpen(false);
        setIntro(true);
        props.moveRovers(input, data.output);
      }
      else if (data.status == "i_error") {
        alert("Error: input is invalid");
      }
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
  }

  function renderIntro() {
    return <Box sx={style}>
      <Typography
        id={"modal-modal-title"}
        variant={"h6"}
        component={"h2"}
        style = {{
          color: "#fcc4a1",
          fontWeight: "bold",
        }}
        >
        Welcome to the Mars Rover Challenge!
      </Typography>
      <Typography id={"modal-modal-description"} style = {{
        color: "grey",
        fontSize: 14,
        marginTop: 10,
      }}>
        The challenge is to find the end coordinates of a set of mars rovers given a grid, their starting positions, and a list of movement instructions.<br/>
      </Typography>
      <Typography id={"modal-modal-description"} style = {{
        color: "grey",
        fontSize: 12,
        marginTop: 10,
      }}>
        <i>You can find out more <a href = "https://code.google.com/archive/p/marsrovertechchallenge/" target = "_blank">here</a></i>
      </Typography>
      <Button
        onClick={() => {
          setIntro(false);
        }}
        variant={"outlined"}
        color={"success"}
        style = {{
          marginTop: 20,
        }}
        >
        Lets get started!
      </Button>
    </Box>;
  }

  function renderConfig() {
    return <Box sx={style}>
      <Typography
        id={"modal-modal-title2"}
        variant={"h6"}
        component={"h2"}
        style = {{
          color: "#fcc4a1",
          fontWeight: "bold",
        }}
        >
        <u>Setup config</u>
      </Typography>
      <Typography style = {{
        color: "grey",
        fontSize: 14,
        marginTop: 10,
      }}>
        Mars Base to Mission Control... Mars Base to Mission Control... What are your instructions?<br/><br/>
      </Typography>
      <Typography style = {{
        color: "grey",
        fontSize: 14,
      }}>
        Example Input:<br/>
      </Typography>
      <div style = {{
        whiteSpace: "pre",
        backgroundColor: "black",
        color: "white",
        padding: 5,
      }}>
        5 5<br/>
        1 2 N<br/>
        LMLMLMLMM<br/>
        3 3 E<br/>
        MMRMMRMRRM<br/>
      </div>
    
      <Typography style = {{
        color: "grey",
        fontSize: 14,
        marginTop: 10,
      }}>
        Expected Output:<br/>
      </Typography>
      <pre style = {{
        whiteSpace: "pre",
        backgroundColor: "black",
        color: "white",
        padding: 5,
      }}>
        1 3 N<br/>
        5 1 E<br/>
      </pre>

      <TextField
        id="input-textfield"
        label="Your Input"
        multiline
        onChange={(e) => {
          setInput(e.target.value);
        }}
        style = {{
          marginTop: 10,
          width: "100%",
        }}
      />
      <br/>
      
      <Button
        onClick={() => {
          calculateOutput();
        }}
        variant={"outlined"}
        color={"success"}
        style = {{
          marginTop: 20,
        }}
        >
        Go!
      </Button>
    </Box>;
  }

  return (
    <Modal
      open={modalOpen}
    >
      {
        (intro) ? (
          renderIntro()
        ) :
        renderConfig()
      }
    </Modal>
  )
}
