import * as THREE from "three";

/**
 * Build a decal geometry by clipping a mesh with an oriented bounding box.
 * This is a simplified prototype based on the project directive.
 * Triangles are kept when their center lies inside the box.
 *
 * @param {THREE.Mesh} mesh target mesh
 * @param {THREE.Vector3} position center of the decal box in world space
 * @param {THREE.Euler} orientation orientation of the decal box
 * @param {THREE.Vector3} size dimensions of the decal box
 * @returns {THREE.BufferGeometry} resulting geometry
 */
export function buildBoxDecal(mesh, position, orientation, size) {
  const transform = new THREE.Matrix4();
  transform.makeRotationFromEuler(orientation);
  transform.setPosition(position);

  const invTransform = transform.clone().invert();
  const half = size.clone().multiplyScalar(0.5);

  const worldPos = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const center = new THREE.Vector3();

  const vertices = [];
  const normals = [];
  const uvs = [];

  const posAttr = mesh.geometry.attributes.position;
  const normAttr = mesh.geometry.attributes.normal;
  const indexAttr = mesh.geometry.index;

  function inside(v) {
    return (
      Math.abs(v.x) <= half.x &&
      Math.abs(v.y) <= half.y &&
      Math.abs(v.z) <= half.z
    );
  }

  function pushTri(a, b, c, na, nb, nc) {
    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    normals.push(na.x, na.y, na.z, nb.x, nb.y, nb.z, nc.x, nc.y, nc.z);
    uvs.push(
      0.5 + a.x / size.x,
      0.5 + a.y / size.y,
      0.5 + b.x / size.x,
      0.5 + b.y / size.y,
      0.5 + c.x / size.x,
      0.5 + c.y / size.y,
    );
  }

  function getVertex(i) {
    worldPos.fromBufferAttribute(posAttr, i);
    worldPos.applyMatrix4(mesh.matrixWorld);
    worldPos.applyMatrix4(invTransform);
    if (normAttr) {
      normal.fromBufferAttribute(normAttr, i);
      normal.transformDirection(mesh.matrixWorld);
      return [worldPos.clone(), normal.clone()];
    }
    return [worldPos.clone(), new THREE.Vector3(0, 0, 0)];
  }

  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i += 3) {
      const a = indexAttr.getX(i);
      const b = indexAttr.getX(i + 1);
      const c = indexAttr.getX(i + 2);

      const [p0, n0] = getVertex(a);
      const [p1, n1] = getVertex(b);
      const [p2, n2] = getVertex(c);

      center
        .copy(p0)
        .add(p1)
        .add(p2)
        .multiplyScalar(1 / 3);
      if (inside(center)) {
        pushTri(p0, p1, p2, n0, n1, n2);
      }
    }
  } else {
    for (let i = 0; i < posAttr.count; i += 3) {
      const [p0, n0] = getVertex(i);
      const [p1, n1] = getVertex(i + 1);
      const [p2, n2] = getVertex(i + 2);
      center
        .copy(p0)
        .add(p1)
        .add(p2)
        .multiplyScalar(1 / 3);
      if (inside(center)) {
        pushTri(p0, p1, p2, n0, n1, n2);
      }
    }
  }

  const result = new THREE.BufferGeometry();
  result.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  result.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  result.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  result.applyMatrix4(transform);
  return result;
}
