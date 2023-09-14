import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from './Mars_perseverance_rover';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function RoverCanvas(props) {   
   return (
      <div style = {{
         margin: 0,
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         height: "100vh",
      }}>
      <Canvas
         camera={{ position: [2, 0, 12.25], fov: 15 }}
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
            <Model
               position = {[0.025, -0.9, 0]}
               model = {props.model}
            />
         </Suspense>
         <OrbitControls />
      </Canvas>
      </div>
   );
}