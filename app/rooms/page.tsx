'use client'
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

// A simple door component
function Door({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 2, 0.1]} />
      <meshStandardMaterial color="brown" />
    </mesh>
  );
}

// The room with walls, floor, ceiling, and a door
function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 1, -5]}>
        <boxGeometry args={[10, 3, 0.1]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      <mesh position={[0, 1, 5]}>
        <boxGeometry args={[10, 3, 0.1]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      <mesh position={[-5, 1, 0]}>
        <boxGeometry args={[0.1, 3, 10]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      <mesh position={[5, 1, 0]}>
        <boxGeometry args={[0.1, 3, 10]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Door */}
      <Door position={[5, 0, 0]} />
    </group>
  );
}

// Camera controller that moves the camera smoothly to the new position
function CameraController({ position }: { position: THREE.Vector3 }) {
  const cameraRef = useRef<any>(null);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.lerp(position, 0.1);
    }
  });
   // @ts-ignore
  return <perspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 10]} fov={75} />;
}

// Heads-Up Display (HUD) for controlling movement
function Hud({ moveForward, moveBackward }: { moveForward: () => void; moveBackward: () => void }) {
  return (
    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex' }}>
      <button onClick={moveForward} style={{ marginRight: '10px' }}>Forward</button>
      <button onClick={moveBackward}>Backward</button>
    </div>
  );
}

// Light component to enhance room lighting
function RoomLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
    </>
  );
}

// A simple table component
function Table({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 0.1, 1]} />
      <meshStandardMaterial color="saddlebrown" />
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
      <mesh position={[1.9, -0.6, 0]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
      <mesh position={[0, -0.6, 0.9]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
      <mesh position={[1.9, -0.6, 0.9]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
    </mesh>
  );
}

// A simple chair component
function Chair({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="darkblue" />
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="darkblue" />
      </mesh>
      <mesh position={[0.4, -0.5, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="darkblue" />
      </mesh>
      <mesh position={[0, -0.5, 0.4]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="darkblue" />
      </mesh>
      <mesh position={[0.4, -0.5, 0.4]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="darkblue" />
      </mesh>
      <mesh position={[0, 0.5, -0.25]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="darkblue" />
      </mesh>
    </mesh>
  );
}

// Main RoomExplorer component
export default function RoomExplorer() {
  const [position, setPosition] = useState(new THREE.Vector3(0, 2, 10));
  const [log, setLog] = useState<string[]>([]);

  const moveForward = () => {
    setPosition((prev) => {
      const newPosition = prev.clone().add(new THREE.Vector3(0, 0, -0.5));
      updateLog('Moved Forward');
      return newPosition;
    });
  };

  const moveBackward = () => {
    setPosition((prev) => {
      const newPosition = prev.clone().add(new THREE.Vector3(0, 0, 0.5));
      updateLog('Moved Backward');
      return newPosition;
    });
  };

  const updateLog = (action: string) => {
    setLog((prevLog) => [...prevLog, action]);
  };

  return (
    <div className={'w-full h-screen'}>
      <Canvas>
        <RoomLights />
        <Room />
        <Table position={[0, -0.5, 2]} />
        <Chair position={[-1, -0.5, 2]} />
        <Chair position={[1, -0.5, 2]} />
        <CameraController position={position} />
        <OrbitControls />
      </Canvas>
      <Hud moveForward={moveForward} moveBackward={moveBackward} />
      <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white' }}>
        <h3>Action Log:</h3>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
