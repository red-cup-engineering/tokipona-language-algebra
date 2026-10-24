import { EMPTY_WITNESS_ROOT, identifyJsonSemanticContent } from "@red-cup-engineering/semantic-content-identify-service";

export function jsonId(value, objectKind) {
  if (typeof objectKind !== "string" || objectKind.length === 0) throw new TypeError("semantic object kind is required");
  return identifyJsonSemanticContent({ objectKind, value, witnessRoot: EMPTY_WITNESS_ROOT }).token;
}
