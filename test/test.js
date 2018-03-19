import expect from "expect";

import Path from "../src/js/path/path";
import testMiddlePathData from "./testMiddlePathData.json";
import testConnectionsData from "./testConnectionsData.json";
import testCompletePathData from "./testCompletePathData.json";

const path = new Path();

export default function test() {
  testMiddlePathData.map(n =>
    expect(path.getMiddlePath({ start: n.start, end: n.end })).toEqual(
      n.connection
    )
  );

  testConnectionsData.map(n =>
    expect(
      path.getConnections({ startRect: n.startRect, endRect: n.endRect })
    ).toEqual({ startPath: n.startPath, endPath: n.endPath })
  );

  testCompletePathData.map(n =>
    expect(
      path.getPath({ startObject: n.startObject, endObject: n.endObject })
    ).toEqual(n.path)
  );
}
