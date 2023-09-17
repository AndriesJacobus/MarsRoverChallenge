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

   useEffect(() => {
      if (configModalRef != null) {
         configModalRef.current(true);
      }
   }, [configModalRef]);

   function moveRovers(input, output) {
      setShowControlls(true);
      setCurrentInput(input);
      setCurrentOutput(output);
   }

   function centerCam() {
      if (terrainRef != null) {
         terrainRef.current(true);
      }
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
            camera={{ position: [2, 45, 12.25], fov: 10, }}
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
               <Rover
                  position = {[0.025, -0.57, -0.6]}
                  model = {props.roverModel}
               />
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
            showControlls && <RoverControlls input = {currentInput} output = {currentOutput} recenterCam = {centerCam} />
         }
      </div>
   );
}