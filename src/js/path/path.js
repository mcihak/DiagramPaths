import { NORTH, EAST, SOUTH, WEST, DELTA } from "./constants";

export default class Path {
  // return complete path connecting two objects
  getPath({ startObject, endObject }) {
    if (
      startObject.vertexA.x >= startObject.vertexB.x ||
      startObject.vertexA.y >= startObject.vertexB.y ||
      endObject.vertexA.x >= endObject.vertexB.x ||
      endObject.vertexA.y >= endObject.vertexB.y
    ) {
      throw new Error("Incorrect coordinates of rectanle vertices.");
    }

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
      if (start.point.y === end.point.y) {
        return [];
      } else {
        const xMid = Math.floor((start.point.x + end.point.x) / 2);
        return [{ x: xMid, y: start.point.y }, { x: xMid, y: end.point.y }];
      }
    } else if (
      (start.direction === SOUTH && end.direction === NORTH) ||
      (start.direction === NORTH && end.direction === SOUTH)
    ) {
      if (start.point.x === end.point.x) {
        return [];
      } else {
        const yMid = Math.floor((start.point.y + end.point.y) / 2);
        return [{ x: start.point.x, y: yMid }, { x: end.point.x, y: yMid }];
      }
    } else if (
      start.direction === EAST &&
      (end.direction === NORTH || end.direction === SOUTH)
    ) {
      if (start.point.x === end.point.x || start.point.y === end.point.y) {
        return [];
      } else {
        return [{ x: end.point.x, y: start.point.y }];
      }
    } else if (
      (start.direction === NORTH || start.direction === SOUTH) &&
      end.direction === WEST
    ) {
      if (start.point.x === end.point.x || start.point.y === end.point.y) {
        return [];
      } else {
        return [{ x: start.point.x, y: end.point.y }];
      }
    } else if (start.direction === SOUTH && start.direction === SOUTH) {
      if (start.point.y === end.point.y) {
        return [];
      } else if (start.point.y < end.point.y) {
        return [{ x: start.point.x, y: end.point.y }];
      } else {
        return [{ x: end.point.x, y: start.point.y }];
      }
    } else if (start.direction === NORTH && start.direction === NORTH) {
      if (start.point.y === end.point.y) {
        return [];
      } else if (start.point.y < end.point.y) {
        return [{ x: end.point.x, y: start.point.y }];
      } else {
        return [{ x: start.point.x, y: end.point.y }];
      }
    } else {
      throw new Error("Unsupported combination of middle path directions.");
    }
  }

  // return object containing original rectangle and connector coordinates
  // enriched by starting direction of the connector
  getRectangleWithDirection({ vertexA, vertexB, connector }) {
    if (
      vertexA.x === connector.x &&
      vertexA.y < connector.y &&
      connector.y < vertexB.y
    ) {
      return {
        vertexA,
        vertexB,
        connector,
        direction: WEST
      };
    } else if (
      vertexB.x === connector.x &&
      vertexA.y < connector.y &&
      connector.y < vertexB.y
    ) {
      return {
        vertexA,
        vertexB,
        connector,
        direction: EAST
      };
    } else if (
      vertexA.y === connector.y &&
      vertexA.x < connector.x &&
      connector.x < vertexB.x
    ) {
      return {
        vertexA,
        vertexB,
        connector,
        direction: NORTH
      };
    } else if (
      vertexB.y === connector.y &&
      vertexA.x < connector.x &&
      connector.x < vertexB.x
    ) {
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

  //***************************************
  //***************************************
  //***************************************

  // return connection paths for two enriched rectangle objects
  getConnections({ startRect, endRect }) {
    if (endRect.direction === WEST) {
      const endPath = [
        endRect.connector,
        { x: endRect.connector.x - DELTA, y: endRect.connector.y }
      ];
      if (startRect.direction === WEST) {
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
      } else if (startRect.direction === EAST) {
        return {
          startPath: [
            startRect.connector,
            // direction EAST
            {
              x: startRect.connector.x + DELTA,
              y: startRect.connector.y
            }
          ],
          // direction WEST
          endPath
        };
      } else if (startRect.direction === NORTH) {
        const secondPoint = {
          x: startRect.connector.x,
          y: startRect.connector.y - DELTA
        };
        if (startRect.vertexA.y - DELTA < endRect.connector.y) {
          return {
            startPath: [
              startRect.connector,
              // direction NORTH
              secondPoint,
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
              // direction NORTH
              secondPoint
            ],
            // direction WEST
            endPath
          };
        }
      } else if (startRect.direction === SOUTH) {
        const secondPoint = {
          x: startRect.connector.x,
          y: startRect.connector.y + DELTA
        };
        if (startRect.vertexB.y + DELTA > endRect.connector.y) {
          return {
            startPath: [
              startRect.connector,
              // direction SOUTH
              secondPoint,
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
              // direction SOUTH
              secondPoint
            ],
            // direction WEST
            endPath
          };
        }
      }
    }

    //***************************************
    //***************************************
    //***************************************

    if (endRect.direction === EAST) {
      const secondPoint = {
        x: endRect.connector.x + DELTA,
        y: endRect.connector.y
      };
      if (startRect.direction === EAST) {
        const startPath = [
          startRect.connector,
          { x: startRect.connector.x + DELTA, y: startRect.connector.y }
        ];
        if (endRect.connector.y > startRect.connector.y) {
          if (endRect.vertexA.y - DELTA < startRect.connector.y) {
            return {
              // direction EAST
              startPath,
              endPath: [
                endRect.connector,
                // direction EAST
                secondPoint,
                // direction NORTH
                {
                  x: endRect.connector.x + DELTA,
                  y: endRect.vertexA.y - DELTA
                },
                // direction WEST
                {
                  x: endRect.vertexA.x - DELTA,
                  y: endRect.vertexA.y - DELTA
                }
              ]
            };
          } else {
            return {
              // direction EAST
              startPath,
              endPath: [
                endRect.connector,
                // direction EAST
                secondPoint,
                // direction NORTH
                {
                  x: endRect.connector.x + DELTA,
                  y: endRect.vertexA.y - DELTA
                }
              ]
            };
          }
        } else {
          if (endRect.vertexB.y + DELTA > startRect.connector.y) {
            return {
              // direction EAST
              startPath,
              endPath: [
                endRect.connector,
                // direction EAST
                secondPoint,
                // direction SOUTH
                {
                  x: endRect.connector.x + DELTA,
                  y: endRect.vertexB.y + DELTA
                },
                // direction WEST
                {
                  x: endRect.vertexA.x - DELTA,
                  y: endRect.vertexB.y + DELTA
                }
              ]
            };
          } else {
            return {
              // direction EAST
              startPath,
              endPath: [
                endRect.connector,
                // direction EAST
                secondPoint,
                // direction SOUTH
                {
                  x: endRect.connector.x + DELTA,
                  y: endRect.vertexB.y + DELTA
                }
              ]
            };
          }
        }
      } else if (startRect.direction === WEST) {
        return {
          startPath: [
            startRect.connector,
            // direction WEST
            {
              x: startRect.connector.x - DELTA,
              y: startRect.connector.y
            },
            // direction SOUTH
            {
              x: startRect.connector.x - DELTA,
              y: startRect.vertexB.y + DELTA
            }
          ],
          endPath: [
            endRect.connector,
            // direction EAST
            secondPoint,
            // direction SOUTH
            {
              x: endRect.connector.x + DELTA,
              y: endRect.vertexB.y + DELTA
            }
          ]
        };
      } else if (startRect.direction === NORTH) {
        return {
          startPath: [
            startRect.connector,
            // direction NORTH
            {
              x: startRect.connector.x,
              y: startRect.connector.y - DELTA
            }
          ],
          endPath: [
            endRect.connector,
            // direction EAST
            secondPoint,
            // direction NORTH
            {
              x: endRect.connector.x + DELTA,
              y: endRect.vertexA.y - DELTA
            }
          ]
        };
      } else if (startRect.direction === SOUTH) {
        return {
          startPath: [
            startRect.connector,
            // direction SOUTH
            {
              x: startRect.connector.x,
              y: startRect.connector.y + DELTA
            }
          ],
          endPath: [
            endRect.connector,
            // direction EAST
            secondPoint,
            // direction SOUTH
            {
              x: endRect.connector.x + DELTA,
              y: endRect.vertexB.y + DELTA
            }
          ]
        };
      }
    }
  }
}
