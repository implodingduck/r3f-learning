import { createRoot } from 'react-dom/client'
import React, { useRef, useState, createContext, useContext, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Outline, Selection, EffectComposer, Select } from '@react-three/postprocessing'


useGLTF.preload('/duck.gltf')

function Duck(props){
  const meshRef = useRef()

  const [rotMod, setRotMod] = useState(1)

  useFrame((state, delta) => (meshRef.current.rotation.y += delta * rotMod))

  const { nodes, materials } = useGLTF('/duck.gltf')
  return (
    <group {...props} dispose={null}>
          <mesh
            ref={meshRef}
            onClick={(e) => setRotMod(rotMod * -1)}
            castShadow receiveShadow geometry={nodes.Node.geometry} material={materials.palette}>
          </mesh>
          <EffectComposer autoClear={false}>
            <Outline visibleEdgeColor={0xff33ff} hiddenEdgeColor={0xff00ff} edgeStrength={10} blur={false} selection={[meshRef]} />
          </EffectComposer>
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
    <group>
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => { setHover(true) }}
        onPointerOut={(event) => { setHover(false) }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
      <EffectComposer autoClear={false}>
        {/* <Outline visibleEdgeColor={0xff33ff} hiddenEdgeColor={0xff00ff} edgeStrength={10} blur={false} selection={ (hovered) ? [] : [meshRef]} /> */}
        <Outline visibleEdgeColor={0x33ff33} hiddenEdgeColor={0x33ff33} edgeStrength={10} blur={false} selection={ (hovered) ? [meshRef] : []} />
      </EffectComposer>
    </group>
  )
}

export default function App() {

  return (<>
  <Canvas>
    <color attach="background" args={['#666666']} />
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    
    <Box position={[-1.2, 0, 0]}  />
    <Duck position={[1.2, -1, 0]}  />
    <Duck position={[1.2, 1, 0]}  />
    
  </Canvas>
  </>)
}
