import { NORTH, EAST, SOUTH, WEST, DELTA } from "./constants";

export default class Path {
  // return complete path connecting two objects
  getPath({ startObject, endObject }) {
    const startRect = this.getRectangleWithDirection(startObject);
    const endRect = this.getRectangleWithDirection(endObject);
    const connections = this.getConnections({ startRect, endRect });
    const start = this.getConnectionEndPoint(connections.startPath);
    const end = this.getConnectionEndPoint(connections.endPath);
    const middlePath = this.getMiddlePath({ start, end });
    return connections.startPath
      .concat(middlePath)
      .concat(connections.endPath.slice().reverse());
  }

  // return a path connecting two points with given starting directions
  getMiddlePath({ start, end }) {
    if (start.direction === EAST && end.direction === WEST) {
      const xMid = Math.floor((start.point.x + end.point.x) / 2);
      return [
        start.point,
        { x: xMid, y: start.point.y },
        { x: xMid, y: end.point.y },
        end.point
      ];
    } else if (
      (start.direction === SOUTH && end.direction === NORTH) ||
      (start.direction === NORTH && end.direction === SOUTH)
    ) {
      const yMid = Math.floor((start.point.y + end.point.y) / 2);
      return [
        start.point,
        { x: start.point.x, y: yMid },
        { x: end.point.x, y: yMid },
        end.point
      ];
    } else if (
      start.direction === EAST &&
      (end.direction === NORTH || end.direction === SOUTH)
    ) {
      return [start.point, { x: end.point.x, y: start.point.y }, end.point];
    } else if (
      (start.direction === NORTH || start.direction === SOUTH) &&
      end.direction === WEST
    ) {
      return [start.point, { x: start.point.x, y: end.point.y }, end.point];
    } else {
      throw new Error("Unsupported combination of middle path directions.");
    }
  }

  // return object containing original rectangle and connector coordinates
  // enriched by starting direction of the connector
  getRectangleWithDirection({ vertexA, vertexB, connector }) {
    if (vertexA.x === connector.x) {
      return {
        vertexA,
        vertexB,
        connector,
        direction: WEST
      };
    } else if (vertexB.x === connector.x) {
      return {
        vertexA,
        vertexB,
        connector,
        direction: EAST
      };
    } else if (vertexA.y === connector.y) {
      return {
        vertexA,
        vertexB,
        connector,
        direction: NORTH
      };
    } else if (vertexB.y === connector.y) {
      return {
        vertexA,
        vertexB,
        connector,
        direction: SOUTH
      };
    } else {
      throw new Error("Incorrect position of the connector.");
    }
  }

  // return object containing last point of the connection path
  // and direction of the last segment of the path
  getConnectionEndPoint(connection) {
    const lastPoint = connection[connection.length - 1];
    const lastButOne = connection[connection.length - 2];
    if (lastPoint.x < lastButOne.x && lastPoint.y === lastButOne.y) {
      return {
        point: lastPoint,
        direction: WEST
      };
    } else if (lastPoint.x > lastButOne.x && lastPoint.y === lastButOne.y) {
      return {
        point: lastPoint,
        direction: EAST
      };
    } else if (lastPoint.x === lastButOne.x && lastPoint.y < lastButOne.y) {
      return {
        point: lastPoint,
        direction: NORTH
      };
    } else if (lastPoint.x === lastButOne.x && lastPoint.y > lastButOne.y) {
      return {
        point: lastPoint,
        direction: SOUTH
      };
    } else {
      throw new Error("Incorrect connection point coordinates.");
    }
  }

  // return connection paths for two enriched rectangle objects
  getConnections({ startRect, endRect }) {
    if (startRect.direction === WEST) {
      if (endRect.direction === WEST) {
        const endPath = [
          endRect.connector,
          { x: endRect.connector.x - DELTA, y: endRect.connector.y }
        ];
        const secondPoint = {
          x: startRect.connector.x - DELTA,
          y: startRect.connector.y
        };
        if (startRect.connector.y > endRect.connector.y) {
          if (startRect.vertexA.y - DELTA < endRect.connector.y) {
            return {
              startPath: [
                startRect.connector,
                // direction WEST
                secondPoint,
                // direction NORTH
                {
                  x: startRect.connector.x - DELTA,
                  y: startRect.vertexA.y - DELTA
                },
                // direction EAST
                {
                  x: startRect.vertexB.x + DELTA,
                  y: startRect.vertexA.y - DELTA
                }
              ],
              // direction WEST
              endPath
            };
          } else {
            return {
              startPath: [
                startRect.connector,
                // direction WEST
                secondPoint,
                // direction NORTH
                {
                  x: startRect.connector.x - DELTA,
                  y: startRect.vertexA.y - DELTA
                }
              ],
              // direction WEST
              endPath
            };
          }
        } else {
          if (startRect.vertexB.y + DELTA > endRect.connector.y) {
            return {
              startPath: [
                startRect.connector,
                // direction WEST
                secondPoint,
                // direction SOUTH
                {
                  x: startRect.connector.x - DELTA,
                  y: startRect.vertexB.y + DELTA
                },
                // direction EAST
                {
                  x: startRect.vertexB.x + DELTA,
                  y: startRect.vertexB.y + DELTA
                }
              ],
              // direction WEST
              endPath
            };
          } else {
            return {
              startPath: [
                startRect.connector,
                // direction WEST
                secondPoint,
                // direction SOUTH
                {
                  x: startRect.connector.x - DELTA,
                  y: startRect.vertexB.y + DELTA
                }
              ],
              // direction WEST
              endPath
            };
          }
        }
      } else if (endRect.direction === NORTH) {
      } else if (endRect.direction === EAST) {
      } else if (endRect.direction === SOUTH) {
      }
    }
  }
}
