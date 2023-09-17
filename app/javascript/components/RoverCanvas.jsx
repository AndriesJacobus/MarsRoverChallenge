import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Rover from './Mars_perseverance_rover';
import MarsTerrain from './Mars_surface_terrain_model';
import RoverConfigModal from './RoverConfigModal';
import RoverControlls from './RoverControlls';

export default function RoverCanvas(props) {
   const configModalRef = useRef(null);
   const terrainRef = useRef(null);
   const [showControlls, setShowControlls] = useState(false);
   const [currentInput, setCurrentInput] = useState(null);
   const [currentOutput, setCurrentOutput] = useState(null);
   const [rovers, setRovers] = useState(null);

   useEffect(() => {
      if (configModalRef != null) {
         configModalRef.current(true);
      }
   }, [configModalRef]);

   function moveRovers(input, output) {
      setShowControlls(true);
      setCurrentInput(input);
      setCurrentOutput(output);
      renderRovers(input);
   }

   function centerCam() {
      if (terrainRef != null) {
         terrainRef.current(true);
      }
   }

   function renderRovers(input) {
      let inputDetails = input.split("\n");
      let newRovers = [];

      let i = 1;
      for (let j = 0; j < ((inputDetails.length - 1) / 2); j++) {
         newRovers.push(
            <Rover
               key = {"r" + j}
               position = {[ -0.35, -0.57, -0.1]}
               model = {props.roverModel}
               startPosition = {inputDetails[i].split(" ")}
               instructions = {inputDetails[i + 1]}
            />
         );
         i = i + 2;
      }

      setRovers(newRovers);
   }

   function refreshCanvas() {
      setShowControlls(false);
      setCurrentInput(null);
      setCurrentOutput(null);
      setRovers(null);
      configModalRef.current(true);
   }

   return (
      <div style = {{
         margin: 0,
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         height: "98vh",
      }}>
         <Canvas
            // camera={{ position: [2, 45, 12.25], fov: 10, }}
            camera={{ position: [-0.5, 45, 12.25], fov: 10, }}
            style={{
               backgroundColor: '#fcc4a1',
               width: '100vw',
               height: '100vh',
            }}
            >
            <ambientLight intensity = {1.5} />
            <ambientLight intensity = {0.1} />
            <directionalLight intensity = {1} />
            <Suspense fallback = {null}>
               {/* <Rover
                  position = {[0.025, -0.57, -0.1]}
                  model = {props.roverModel}
                  instructions = {"RRRRM"}
                  // instructions = {"LLLLM"}
               /> */}
               {
                  rovers
               }
               <MarsTerrain
                  position = {[-3.5, 0, 3.5]}
                  model = {props.terrainModel}
                  centerCam = {terrainRef}
               />
            </Suspense>
            <OrbitControls />
         </Canvas>
         <RoverConfigModal
            setModalOpen = {configModalRef}
            moveRovers = {moveRovers}
            authToken = {props.authToken}
         />
         {
            showControlls && <RoverControlls input = {currentInput} output = {currentOutput} recenterCam = {centerCam} refresh = {refreshCanvas} />
         }
      </div>
   );
}