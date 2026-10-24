// tag.mjs — the die's own offered operation. This runs the REAL
// articulate → construe(tag → feature → relate → charge) → descend → fold →
// parse pipeline from linguistics-services-section's shared
// ../../../lib/language-engine/ — the same language-agnostic engine
// latin-language-algebra and lakota-language-algebra use, ported (TypeScript
// types stripped, logic unchanged) from the recovered @lenticule-science/language-
// topology (articulating.mts, tagging.mts, featuring.mts, relating.mts,
// charging.mts, descending.mts, folding.mts, construing.mts, parsing.mts,
// cohomology.mts) and @lenticule-science/language-algebra (charge.mts, compile.mts) and
// @lenticule-science/language-analysis (semantics/roles.mts). Every stage is a real,
// deterministic function of (text, rawBundle): tags come from actually
// testing morphology.suffixRules (empty for Toki Pona — isolating morphology,
// see README) and closed-class lexicon membership, arcs come from actually
// running the attachment rules (Toki Pona is SVO with subject: "left" /
// object: "right" — genuinely distinct directions, unlike Lakota's SOV
// collision — see README's honest gap list for what still goes wrong when no
// word is ever tagged "verb"), and settlement comes from actually running the
// bilattice fixed-point (descend) and the fold tower.
//
// This is exactly the pipeline the original recovered src/parity.test.mts
// exercised (tag from language-topology) before this die's package boundary
// dropped that workspace package — see README.md. Like Lakota, the recovered
// Toki Pona parity.test.mts never imported roles from @lenticule-science/language-
// analysis; this die still exposes it (mirroring latin-die.mjs's and
// lakota-die.mjs's CLI contract exactly and because the shared engine carries
// it at no extra porting cost), but no original Toki Pona fixture exercised
// it — see README's honest gap list.
import { rawBundle } from "./bundle.mjs";
import { load, articulate, parse, tag as tagWord, roles as extractRoles, cohomology } from "@lenticule-science/linguistics-services-section/lib/language-engine/index.mjs";

/** The compiled Toki Pona fiber — lexicon/morphology/reference resolved into
 * the lookup functions the engine runs over (the shared engine's own
 * `load`). */
export const bundle = load(rawBundle);

/** Real per-word POS tag, via the engine's own tag() (closed-class lexicon,
 * then open-class suffix morphology, floor = noun). Exposed standalone
 * because the original recovered parity test asserted against it directly. */
export function tagWordPos(word) {
  return tagWord(word, bundle);
}

/** Tokenize on the engine's own Unicode-aware word tokenizer (word = a run of
 * letters/marks/numbers joined by ' / ʼ / ‐ / -), which naturally excludes
 * sentence-terminating punctuation — no separate strip-then-split step. */
export function tokenize(text) {
  return articulate(text, bundle).spans
    .filter((s) => s.tier === "word")
    .map((s) => s.text);
}

/**
 * Parse `text` for real: articulate into sentence spans, run the full
 * construe→descend→fold pipeline on each sentence, and extract syntax-derived
 * semantic role frames (agent/patient/instrument/recipient/location) via
 * the shared engine's roles(). Returns one entry per sentence found (or one
 * entry for the whole text if no sentence terminator was present).
 *
 * This is a real, deterministic function of (text, rawBundle) — byte-
 * identical in yields byte-identical out — computed by actually running the
 * settlement engine (not a flat per-word lookup).
 */
export function tagText(text) {
  const base = articulate(text, bundle);
  const sentenceSpans = base.spans.filter((s) => s.tier === "sentence");
  const spans = sentenceSpans.length > 0 ? sentenceSpans : [base.document];

  const sentences = spans.map((sentenceSpan) => {
    const result = parse(sentenceSpan, base, bundle);
    return {
      text: sentenceSpan.text,
      words: result.words.map((w) => ({ text: w.text, tags: w.tags, feats: w.feats, connected: w.connected, roles: w.roles })),
      arcs: result.arcs.map((a) => ({ rel: a.rel, head: a.headText, dependent: a.depText, status: a.status })),
      roles: extractRoles(result),
      tower: result.tower,
      cohomology: cohomology(result),
    };
  });

  return { meta: rawBundle.meta, wordOrder: rawBundle.wordOrder, sentences };
}
