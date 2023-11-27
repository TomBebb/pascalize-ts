import pascalize, {type Pascalize} from "./pascal"
import { expect, test } from "bun:test";

type RawObj = {
    helloWorld: number,
}

test("pascalized(basic obj)", () => {
    expect(pascalize<RawObj>({
        helloWorld: 20
    })).toHaveProperty("HelloWorld", 20)
  });
  