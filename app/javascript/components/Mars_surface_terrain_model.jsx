import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";

export default function MarsTerrain(props) {
  useGLTF.preload(props.model);
  const { nodes, materials } = useGLTF(props.model);
  const [mustCenterCam, setMustCenterCam] = useState(false);
  const vec = new THREE.Vector3();
  
  useEffect(() => {
    if (props.centerCam) {
      props.centerCam.current = setMustCenterCam;
    }
  }, []);

  if (mustCenterCam) {
    useFrame(state => {
      state.camera.position.lerp(vec.set(2, 45, 12.25), 0.1);
      state.camera.updateProjectionMatrix();

      setTimeout(() => {
        setMustCenterCam(false);
      }, 1000);
    });
  }
  else {
    useFrame(() => null, 0);
}

  return (
    <group {...props} dispose={null}>
      <group
        position={props.position}
        rotation={[-1.321, 0.102, 0.01]}
        >
        <group rotation={[-Math.PI, 0, 0]}>
          <mesh geometry={nodes.Model_material0_0.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_1.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_2.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_3.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_4.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_5.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_6.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_7.geometry} material={materials.material0} />
          <mesh geometry={nodes.Model_material0_0_8.geometry} material={materials.material0} />
        </group>
      </group>
    </group>
  )
}

