#!/usr/bin/env node
// tokipona-die.mjs — the live bin script this die advertises for `solicit-service`
// and `invoke-service`. Implements the exact CLI transport run-leader-movement.js's
// invokeOperation() uses: spawned as a subprocess with
// `--operation <name> --now <instant>`, JSON on stdin, JSON on stdout.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { tagText } from "./tag.mjs";
import { jsonId } from "./semantic-identity.mjs";

const CONTEXT = "https://www.w3.org/ns/activitystreams";
const NODE_ID = "tokipona-language-algebra";
const ACTOR = `urn:ame:${NODE_ID}`;
const LMT_ACTOR = "urn:ame:leader-movement-team";

// canonical/digest/contentId mirror run-leader-movement.js's own — plain
// deterministic JSON canonicalization over sha256, so a customer can verify
// this die's digests without pulling in the WitnessJournal relational-value machinery.
function digest(value, objectKind) { return jsonId(value, objectKind); }

function arg(flag) { const index = process.argv.indexOf(flag); return index === -1 ? undefined : process.argv[index + 1]; }
function operationName() { return arg("--operation") ?? "solicit-service"; }
function now() { return arg("--now") ?? new Date().toISOString(); }
function input() { return JSON.parse(readFileSync(arg("--input-file") ?? 0, "utf8")); }
function response(type, source, object) {
  return { "@context": CONTEXT, id: digest({ actor: ACTOR, type, inReplyTo: source?.id ?? null, object }, "lenticule.tokipona-language-algebra.activity"), type, actor: ACTOR, target: source?.actor ?? LMT_ACTOR, inReplyTo: source?.id ?? "urn:activity:unidentified", object };
}
function emit(value, code = 0) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  const outputFile = arg("--output-file");
  if (outputFile === undefined) process.stdout.write(serialized);
  else writeFileSync(outputFile, serialized, "utf8");
  process.exitCode = code;
}
function reject(source, reason, details = {}) {
  emit(response("Reject", source, { type: "Refusal", reason, ...details }), 2);
}

/** Pull the text to tag out of the original Leader activity, if present.
 *  Accepts an explicit `TokiPonaTaggingRequest` attachment ({ text }), or
 *  falls back to the activity's own Note content when it is a nonempty
 *  string — same permissive shape corpus-management-team's provider uses. */
function attachments(note) { return Array.isArray(note?.attachment) ? note.attachment : note?.attachment === undefined ? [] : [note.attachment]; }
function requestedText(sourceActivity) {
  const explicit = attachments(sourceActivity?.object).find((item) => item?.type === "TokiPonaTaggingRequest");
  if (typeof explicit?.text === "string" && explicit.text.length > 0) return explicit.text;
  if (typeof sourceActivity?.object?.content === "string" && sourceActivity.object.content.length > 0) return sourceActivity.object.content;
  return null;
}

function solicit(activity, instant) {
  if (activity?.["@context"] !== CONTEXT || activity.type !== "Offer" || activity.target !== ACTOR || activity.object?.type !== "ServiceSolicitation") {
    reject(activity, "solicitation must be an ActivityStreams Offer<ServiceSolicitation> addressed to this provider");
    return;
  }
  const sourceActivity = activity.object.sourceActivity;
  const text = requestedText(sourceActivity);
  if (text === null) {
    emit(response("Question", activity, { type: "ServiceTermsRequired", sourceActivity: sourceActivity?.id, missing: ["text(nonempty string, as a TokiPonaTaggingRequest attachment or Note content)"] }));
    return;
  }
  const request = { text };
  const requestDigest = digest(request, "lenticule.tokipona-language-algebra.tagging-request");
  const object = {
    type: "ExecutableServiceOffer",
    sourceActivity: sourceActivity.id,
    requestDigest,
    request,
    operation: "invoke-service",
    effects: [],
    requirements: [],
    intentSignature: "urn:service-intent:tag-tokipona-text",
    scope: { textDigest: requestDigest },
  };
  emit(response("Offer", activity, object));
}

function validateInvocation(activity) {
  if (activity?.["@context"] !== CONTEXT || activity.type !== "Accept" || activity.target !== ACTOR) return "invocation must be an ActivityStreams Accept addressed to this provider";
  const contract = activity.object;
  if (contract?.type !== "ServiceContract") return "invocation must accept a ServiceContract";
  const offer = contract.offer;
  if (offer?.type !== "Offer" || offer.actor !== ACTOR || offer.object?.type !== "ExecutableServiceOffer") return "ServiceContract must carry this provider's executable Offer";
  if (offer.object.requestDigest !== digest(offer.object.request, "lenticule.tokipona-language-algebra.tagging-request")) return "accepted request does not match the provider offer digest";
  const capability = contract.capability;
  if (capability?.type !== "Capability" || capability.holder !== ACTOR || capability.invocationTarget !== ACTOR) return "accepted contract requires a capability held by this provider";
  if (capability.parentOffer !== offer.id || capability.attenuation?.requestDigest !== offer.object.requestDigest) return "capability is not attenuated to the accepted offer and request";
  if (!Array.isArray(capability.allowedActions) || !capability.allowedActions.includes("invoke-service")) return "capability does not grant invoke-service";
  return null;
}

function invoke(activity, instant) {
  const invalid = validateInvocation(activity);
  if (invalid) { reject(activity, invalid); return; }
  const offer = activity.object.offer;
  const request = offer.object.request;
  let result;
  try { result = tagText(request.text); }
  catch (error) { reject(activity, "tagging failed before producing a result", { diagnostic: error.message }); return; }
  const resultBody = { type: "TokiPonaTaggingResult", taggedAt: instant, requestDigest: offer.object.requestDigest, sourceActivity: offer.object.sourceActivity, ...result, customerTerritoryMutation: false };
  emit(response("Accept", activity, { ...resultBody, id: digest(resultBody, "lenticule.tokipona-language-algebra.tagging-result") }));
}

function main() {
  const instant = now();
  let activity;
  try { activity = input(); }
  catch (error) { reject({}, `invalid JSON input: ${error.message}`); return; }
  const op = operationName();
  if (op === "solicit-service") solicit(activity, instant);
  else if (op === "invoke-service") invoke(activity, instant);
  else reject(activity, `unknown provider operation ${op}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
