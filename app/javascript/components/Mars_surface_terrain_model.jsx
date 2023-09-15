import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function MarsTerrain(props) {
  useGLTF.preload(props.model);
  const { nodes, materials } = useGLTF(props.model);

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

