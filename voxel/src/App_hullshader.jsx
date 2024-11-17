import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { useGLTF, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/duck.gltf')

const HullMaterial = shaderMaterial(
  {
    color: new THREE.Color('#ff005b'),
    size: 1.5
  },
  /*glsl*/ `
uniform float size;

void main() {
  vec3 transformed = position + normal * size/100.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
}
`,
  /*glsl*/ `
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.);
}
`
)

extend({HullMaterial})

function Duck(props){
  const meshRef = useRef()
  const [rotMod, setRotMod] = useState(1)

  useFrame((state, delta) => (meshRef.current.rotation.y += delta * rotMod))

  const { nodes, materials } = useGLTF('/duck.gltf')
  return (
    <group {...props} dispose={null} ref={meshRef}>
      <mesh
       onClick={(e) => setRotMod(rotMod * -1)}
       castShadow receiveShadow geometry={nodes.Node.geometry} material={materials.palette}>

      </mesh>
      <mesh
        geometry={nodes.Node.geometry}>
        <hullMaterial depthWrite={false} color="#333333" side={THREE.BackSide} />
      </mesh>
    </group>
  )
}


function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function App() {
  return (<Canvas>
    <color attach="background" args={['#f7f4fF']} />
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <Box position={[-1.2, 0, 0]} />
    <Duck position={[1.2, 0, 0]} />
  </Canvas>)
}
