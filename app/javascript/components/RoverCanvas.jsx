import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Rover from './Mars_perseverance_rover';
import MarsTerrain from './Mars_surface_terrain_model';
import RoverConfigModal from './RoverConfigModal';

export default function RoverCanvas(props) {
   const configModalRef = useRef(null);

   useEffect(() => {
      if (configModalRef != null) {
         configModalRef.current(true);
      }
   }, [configModalRef]);

   function startChallenge() {
      configModalRef.current(false);
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
            // camera={{ position: [2, 45, 12.25], fov: 100, }}
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
               />
            </Suspense>
            <OrbitControls />
         </Canvas>
         <RoverConfigModal
            setModalOpen = {configModalRef}
            startChallenge = {startChallenge}
            authToken = {props.authToken}
         />
      </div>
   );
}