import { generate } from "random-words";
export function generateThreeWordId() {
  return generate(3).join("_");
}
