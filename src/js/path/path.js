import { NORTH, EAST, SOUTH, WEST } from "./constants";

export default class Path {
  // return a path connecting two points with given directions

  getPath({ start, end }) {
    if (start.direction === EAST && end.direction === WEST) {
      const xMid = Math.floor((start.point.x + end.point.x) / 2);
      return [
        start.point,
        { x: xMid, y: start.point.y },
        { x: xMid, y: end.point.y },
        end.point
      ];
    }
    if (
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
    }
    if (
      start.direction === EAST &&
      (end.direction === NORTH || end.direction === SOUTH)
    ) {
      return [start.point, { x: end.point.x, y: start.point.y }, end.point];
    }
    if (
      (start.direction === NORTH || start.direction === SOUTH) &&
      end.direction === EAST
    ) {
      return [start.point, { x: start.point.x, y: end.point.y }, end.point];
    }
  }
}
