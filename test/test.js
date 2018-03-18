import expect from "expect";

import Path from "../src/js/path/path";
import testData from "./testData.json";

const path = new Path();

export default function test() {
  testData.map(n =>
    expect(path.getPath({ start: n.start, end: n.end })).toEqual(n.connection)
  );
}
