// Gears.js
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom GearGeometry class to generate gear shapes
class GearGeometry extends THREE.BufferGeometry {
  constructor(
    module = 0.25, // Reduced from 0.5 to 0.25
    teeth = 20,
    thickness = 0.1, // Reduced from 0.2 to 0.1
    boreRadius = 0.1, // Reduced from 0.2 to 0.1
    doubleSided = false
  ) {
    super();

    const pitchRadius = (module * teeth) / 2;
    const addendum = module;
    const dedendum = 1.25 * module;
    const outerRadius = pitchRadius + addendum;
    const innerRadius = Math.max(pitchRadius - dedendum, 0);

    const numPoints = teeth * 4;
    const anglePerTooth = (Math.PI * 2) / teeth;

    const shape = new THREE.Shape();

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      let radius;

      // Define the profile of the tooth
      if (i % 4 === 0 || i % 4 === 3) {
        radius = outerRadius;
      } else {
        radius = innerRadius;
      }

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }

    // Center bore
    if (boreRadius > 0) {
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
      shape.holes.push(holePath);
    }

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false,
      steps: 1,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // If double-sided, create a mirrored copy
    if (doubleSided) {
      const mirroredGeometry = geometry.clone();
      mirroredGeometry.rotateY(Math.PI);
      geometry.merge(mirroredGeometry);
    }

    // Remove rotation to keep gears lying flat
    // geometry.rotateX(-Math.PI / 2); // Commented out to orient gears face-on

    this.copy(geometry);
    this.computeBoundingBox();
    this.computeVertexNormals();
  }
}

// Gear component
const Gear = ({ gearData, gearRefs }) => {
  const { id, position, rotation, module, teeth, thickness, color } = gearData;
  const gearRef = useRef();

  gearRefs.current[id] = { gearRef, gearData };

  useFrame(() => {
    if (gearRef.current) {
      gearRef.current.rotation.z = gearData.currentRotation; // Rotate around Z-axis
    }
  });

  // Create geometry
  const geometry = useMemo(
    () => new GearGeometry(module, teeth, thickness),
    [module, teeth, thickness]
  );

  return (
    <mesh ref={gearRef} position={position} geometry={geometry}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Main Gears component
const Gears = () => {
  const gearRefs = useRef({});

  // Define gears with positions, teeth, and connections
  const gearsData = [
    {
      id: 'gear1',
      position: [0, 0, 0],
      rotation: 0,
      currentRotation: 0,
      module: 0.25, // Reduced module
      teeth: 20,
      thickness: 0.1, // Reduced thickness
      color: 'gold',
      connections: [
        {
          id: 'gear2',
          ratio: null, // Will be calculated
          direction: -1, // Opposite rotation
        },
      ],
      driving: true,
    },
    {
      id: 'gear2',
      position: [0, 0, 0], // Will be updated
      rotation: 0,
      currentRotation: 0,
      module: 0.25,
      teeth: 40,
      thickness: 0.1,
      color: 'silver',
      connections: [
        {
          id: 'gear1',
          ratio: null, // Will be calculated
          direction: -1, // Opposite rotation
        },
        {
          id: 'gear3',
          ratio: null, // Will be calculated
          direction: -1, // Opposite rotation
        },
      ],
    },
    {
      id: 'gear3',
      position: [0, 0, 0], // Will be updated
      rotation: 0,
      currentRotation: 0,
      module: 0.25,
      teeth: 30,
      thickness: 0.1,
      color: 'brown',
      connections: [
        {
          id: 'gear2',
          ratio: null, // Will be calculated
          direction: -1, // Opposite rotation
        },
      ],
    },
  ];

  // Calculate pitch radii and update positions
  gearsData.forEach((gear) => {
    gear.pitchRadius = (gear.module * gear.teeth) / 2;
  });

  // Position gears based on connections
  gearsData.forEach((gear) => {
    gear.connections.forEach((conn) => {
      if (!conn.positioned) {
        const connectedGear = gearsData.find((g) => g.id === conn.id);

        // Calculate center distance
        const centerDistance = gear.pitchRadius + connectedGear.pitchRadius;

        // Position connected gear relative to current gear
        if (gear.positioned) {
          // For simplicity, position along X-axis
          connectedGear.position = [
            gear.position[0] + centerDistance,
            gear.position[1],
            gear.position[2],
          ];
        } else {
          // For the first gear (gear1), it's already positioned
          connectedGear.position = [
            gear.position[0] + centerDistance,
            gear.position[1],
            gear.position[2],
          ];
        }

        connectedGear.positioned = true;

        // Calculate gear ratio
        conn.ratio = connectedGear.teeth / gear.teeth;

        // Mark the reverse connection as positioned
        const reverseConn = connectedGear.connections.find(
          (c) => c.id === gear.id
        );
        if (reverseConn) {
          reverseConn.positioned = true;
          reverseConn.ratio = gear.teeth / connectedGear.teeth;
        }
      }
    });
    gear.positioned = true;
  });

  // Build a map of gears by id for easy access
  const gearsMap = useMemo(() => {
    const map = {};
    gearsData.forEach((gear) => {
      map[gear.id] = gear;
    });
    return map;
  }, [gearsData]);

  // Update rotation of gears
  useFrame(() => {
    const deltaRotation = 0.01;
    const drivingGear = gearsData.find((gear) => gear.driving);
    if (drivingGear) {
      drivingGear.currentRotation += deltaRotation;

      const updatedGears = new Set();
      const updateConnectedGears = (gear) => {
        updatedGears.add(gear.id);
        gear.connections.forEach((conn) => {
          const connectedGear = gearsMap[conn.id];
          if (!updatedGears.has(connectedGear.id)) {
            const rotationChange =
              (deltaRotation * gear.teeth) / connectedGear.teeth * conn.direction;
            connectedGear.currentRotation += rotationChange;
            updateConnectedGears(connectedGear);
          }
        });
      };

      updateConnectedGears(drivingGear);
    }
  });

  return (
    <>
      {gearsData.map((gearData) => (
        <Gear
          key={gearData.id}
          gearData={gearData}
          gearRefs={gearRefs}
        />
      ))}
    </>
  );
};

export default Gears;
