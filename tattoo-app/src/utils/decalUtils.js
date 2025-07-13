import * as THREE from "three";

/**
 * Filter triangles in a decal geometry that exceed a given angle from the projector normal.
 * @param {THREE.BufferGeometry} geometry original decal geometry
 * @param {THREE.Vector3} projectorNormal orientation normal of the decal projector
 * @param {number} maxAngle maximum allowed angle in radians
 * @returns {THREE.BufferGeometry} filtered geometry
 */
export function filterSharpAngles(geometry, projectorNormal, maxAngle) {
  const posAttr = geometry.getAttribute("position");
  const normAttr = geometry.getAttribute("normal");
  const uvAttr = geometry.getAttribute("uv");

  if (!normAttr) return geometry;

  const positions = [];
  const normals = [];
  const uvs = [];

  const tmpNormal = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i += 3) {
    tmpNormal.fromBufferAttribute(normAttr, i);
    if (tmpNormal.angleTo(projectorNormal) <= maxAngle) {
      for (let j = 0; j < 3; j++) {
        positions.push(
          posAttr.getX(i + j),
          posAttr.getY(i + j),
          posAttr.getZ(i + j),
        );
        normals.push(
          normAttr.getX(i + j),
          normAttr.getY(i + j),
          normAttr.getZ(i + j),
        );
        if (uvAttr) {
          uvs.push(uvAttr.getX(i + j), uvAttr.getY(i + j));
        }
      }
    }
  }

  const filtered = new THREE.BufferGeometry();
  filtered.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  filtered.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  if (uvs.length) {
    filtered.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  }
  filtered.computeBoundingSphere();
  filtered.computeBoundingBox();
  return filtered;
}
