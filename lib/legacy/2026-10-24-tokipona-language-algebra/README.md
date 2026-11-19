# tokipona-language-algebra

<!-- 561-group-standards:badges:start -->
[![Lenticule Science](https://img.shields.io/badge/561%20Group-Lenticule%20Science-5b4b8a)](https://github.com/lenticule-science)
[![License: MIT](https://img.shields.io/badge/license-MIT-5b4b8a)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/lenticule-science/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

`@emsenn/tokipona-language-algebra` is Toki Pona's language-fiber data
(lexicon, isolating-morphology tables, reference, attachment, segmentation)
presented live as a discoverable, directly contractable micro-enterprise — a
"die" — of `linguistics-services-section`. It mirrors `latin-language-
algebra`'s and `lakota-language-algebra`'s structure and CLI contract
exactly, and shares those dies' ported settlement engine rather than
re-porting it.

It records SVO word order with the direct-object marker `e` and the
subject-predicate separator `li` filed as closed-class determiners (the
recovered schema has no particle class), a fully isolating morphology
(`suffixRules: []` — no word ever changes shape), and `attachment: {
determiner: "left", adjective: "right", subject: "left", object: "right" }`
— genuinely distinct subject/object directions, unlike Lakota's SOV bundle
where both collide on `"left"`. This does NOT save Toki Pona from its own,
different collision with the shared engine's generic rules — see "what's
still stubbed" below.

## What's real

- `src/bundle.mjs` — the actual Toki Pona lexicon/morphology/reference data,
  transcribed unchanged from the recovered `src/bundle.mts`.
- `../../lib/language-engine/` — linguistics-services-section's shared,
  language-agnostic settlement pipeline, imported here by relative path
  (never a workspace package specifier). This is the **same code** that
  backs `latin-language-algebra` and `lakota-language-algebra`: nothing in
  it is Latin-, Lakota-, or Toki-Pona-specific. **Nothing needed additional
  porting for Toki Pona** — confirmed by reading the recovered Toki Pona
  package's own imports
  (`content/assets/legacy/github-language-packages/tokipona-language-algebra/src/`
  and the duplicate `language-parsing-tokipona/src/` copy under the same
  legacy tree, which carries identical bundle data and grammar under an
  older package-naming scheme — diffed to confirm): `bundle.mts` imports
  only the `RawBundle` *type* from `@emsenn/language-algebra` (erased at
  compile time, nothing at runtime), `index.mts` imports `load` from
  `@emsenn/language-codecs`, and `parity.test.mts` imports `tag` from
  `@emsenn/language-topology` — a strict subset of what the already-ported
  shared engine already carries, same situation as Lakota's port.
- `src/tag.mjs` — wires the die's own `invoke-service` operation to the
  shared engine exactly as the other two dies' `tag.mjs` do: `tagText(text)`
  articulates, parses every sentence, and extracts real syntax-derived
  semantic role frames — a real, deterministic function of `(text,
  rawBundle)`, computed by actually running the settlement engine.
- `content/contracts/tagging-tokipona-text.rml` — a real RMN law, compiled
  by `@emsenn/rmn-semantic-conformance/law`'s `compileRmlLaw` to a real
  content-addressed `ni:///sha-256;vGHricF_F5RpVgZLAJDn8LCgEVSIhArGYmwcRDGF4Zo`
  contract id.
- `content/evm/accounts/eip155-31337.json` — a real (freshly minted, not
  reused from Latin or Lakota, not chain-deployed) `org.emsenn.evm.sovereign-
  enterprise-account.v3` binding that `loadSettlementAccount` from
  `@lenticule-science/witness-journal-rdf-projection-service/client` actually accepts (verified below).
- `content/micro-enterprises/tokipona-language-algebra.json` — validated
  against the live `emsenn/schema/micro-enterprise` schema through the house
  schema reader (borrowed from the sibling `divination` node's installed
  `lib/management/skills/read-a-schema.js`, pointed at its own `lib/schemas`
  pool — the schema content is the same live schema everywhere it is
  seated; `linguistics-services-section` carries no private copy of its
  own).
- `src/tokipona-die.mjs` — the live bin script `run-leader-movement.js`'s
  `invokeOperation` spawns as a subprocess, implementing the real
  `--operation solicit-service` / `--operation invoke-service` CLI contract
  over stdin/stdout JSON — the exact contract `latin-die.mjs`/`lakota-
  die.mjs` implement, with `TokiPonaTaggingRequest`/`TokiPonaTaggingResult`
  names and this die's own actor/contract substituted in.
- **`prep()`/`pobj()` genuinely work for Toki Pona**, unlike Lakota. Toki
  Pona's `lexicon.prepositions` (`lon`, `tan`, `kepeken`, `tawa`, `sama`) are
  real PREPOSITIONS — they precede their NP, the direction both rules
  already assume — so parsing `"soweli li lon tomo."` yields a correct
  `prep: soweli→lon` arc and a correct `pobj: lon→tomo` arc, with a fully
  glued (H0=1, H1=0) cohomology. See `test/engine.test.mjs`'s `"prep()/
  pobj() resolve correctly..."` test.

## What's still stubbed or out of scope

- `data/evm/keystores/eip155-31337.json` exists for file-shape parity with
  working sibling providers, but its key material is all zeros — it is not
  a usable signing key. `loadSettlementAccount` never reads it, so nothing
  in the discovery/admission path depends on it. (Same convention as
  Latin's and Lakota's.)
- `src/bundle.mts`, `src/index.mts`, `src/parity.test.mts`, and the
  `tsconfig*.json` files are kept from the original recovered TypeScript
  package (`.../legacy/github-language-packages/tokipona-language-algebra/`)
  for provenance only; they are not built or executed. `src/bundle.mjs` is
  a plain-JS hand-transcription (types stripped, logic unchanged), not
  compiler output.
- Everything Latin's and Lakota's READMEs list as unported from
  `@emsenn/language-algebra`'s generative-inflection layer and `@emsenn/
  language-analysis`'s other semantic/discourse layers remains unported
  here too, for the same reason: the recovered Toki Pona parity test never
  called any of it (it imports only `tag`).
- **Toki Pona's own recovered `parity.test.mts` never exercises real
  multi-word syntax** — it only asserts `bundle.wordOrder`, the emptiness of
  `suffixRules`/`copula`, `tag("li")`/`tag("e")` including `"det"`, and
  `tag("soweli"|"moku"|"kili")` each flooring to `["noun"]`. Every sentence
  this die's own tests exercise beyond those individual-word assertions
  (`"mi moku e kili."`, `"mi wile moku e kili."`, `"soweli li lon tomo."`)
  is built only from those same fixture words plus closed-class lexicon
  items actually present in `src/bundle.mjs` — no invented Toki Pona
  vocabulary or grammar — but it is this die's own construction, not a
  reproduction of an original recovered multi-word assertion (unlike Latin's
  case-beats-order sentence and Lakota's postposed-determiner sentence,
  which both come directly from their own recovered fixtures).
- **No word is ever tagged `"verb"` for Toki Pona, and this breaks nsubj/
  dobj/roles() for the common case.** `rawBundle.morphology.suffixRules` is
  empty — Toki Pona is fully isolating, so `tagging.mjs`'s open-class floor
  assigns every content word (including true verbs like `moku`, "eat")
  `["noun"]`. The shared engine's `nsubj()`/`dobj()` rules require a word
  tagged `"verb"` OR `"aux"` to anchor an arc on. Without a preverb/
  auxiliary present, **neither rule ever fires at all** — not incorrectly,
  just never. Verified directly: parsing `"mi moku e kili."` (a real
  pronoun + the recovered parity fixture's own two open-class nouns + the
  real object-marker particle — no invented vocabulary) yields **no**
  `nsubj` or `dobj` arc; both `mi` (the true subject) and `moku` (the true
  verb) are left `connected: "void"`, registering as two H¹ underdetermined
  obstructions. `roles()` — which filters strictly on `tags.includes
  ("verb")` — therefore returns `[]` for every possible Toki Pona sentence,
  regardless of how any arcs resolve: this is an inert downstream
  consequence of the same root gap, not a separate defect. See
  `test/engine.test.mjs`'s `"no verb tag ever fires without a preverb..."`
  test for the reproduction.
- **When an auxiliary IS present, `dobj()`'s rightward scan collides with
  the real main verb before reaching the true object — and cohomology gives
  no signal that anything went wrong.** With a preverb like `wile` ("want")
  tagged `"aux"`, `nsubj()` correctly finds the true subject scanning
  leftward. But `dobj()` scans rightward from the aux for the *nearest*
  noun-or-pronoun and stops at the first one — which, since no verb tag
  exists to distinguish it, is the real main verb itself (floored to
  `"noun"` exactly like a true noun), not the true direct object sitting
  further right. Verified directly: parsing `"mi wile moku e kili."` (I
  want [to] eat fruit) yields `nsubj: wile→mi` (correct) but `dobj:
  wile→moku` — `moku` ("eat") is the main verb, not the object; `kili`
  ("fruit"), the true object, is never attached as a `dobj` to anything.
  Worse than the no-auxiliary case: `cohomology()` reports this parse as
  fully **glued** (`h0: 1, h1: 0`) — no obstruction is visible, because
  "glued" tracks structural conflicts, not semantic correctness, and a
  confidently wrong resolution produces no conflict. This is real,
  reproducible behavior of the shared engine's generic `dobj()` rule
  confronted with Toki Pona's real isolating morphology (no verb tag to
  stop the scan at the true predicate) — not a new defect introduced by
  this port. See `test/engine.test.mjs`'s `"dobj ambiguity..."` test for
  the reproduction.
- **The structural particles (`li`, `e`, `la`, `o`, `pi`) are filed as
  closed-class determiners for lack of a particle class, and `det()`
  attaches them accordingly — which does not reflect their real grammatical
  function.** `li` is a subject-predicate separator, `e` is an object
  marker, `la` introduces a context phrase, `o` marks vocative/imperative,
  and `pi` regroups modifier chains; none of them is actually a determiner.
  Because `bundle.attachment.determiner === "left"`, `det()` scans forward
  from each particle for the nearest noun/pronoun and attaches it there —
  visible directly in both example parses above (`det: kili→e`, `det:
  tomo→li`). This produces a syntactically well-formed but semantically
  meaningless `det` arc for every occurrence of these particles; it is a
  property of the recovered Toki Pona **data's schema-slot filing** (same
  documented convention as Lakota's postpositions-filed-as-prepositions),
  not a new defect in the ported **engine**.

## Verify

```sh
npm run check   # node --check on every real .mjs source file, including the shared ../../lib/language-engine/
npm test        # node --test test/  (test/tokipona-die.test.mjs + test/engine.test.mjs)
```

Every sentence exercised in `test/engine.test.mjs` is built only from the
recovered `parity.test.mts`'s own fixture words (`li`, `e`, `soweli`,
`moku`, `kili`) and from closed-class lexicon items actually present in
`src/bundle.mjs` — no invented Toki Pona vocabulary. `test/engine.test.mjs`
also reproduces every individual-word assertion the original recovered
`src/parity.test.mts` made (SVO order, empty `suffixRules`/`copula`, `tag()`
on `li`/`e`/`soweli`/`moku`/`kili`) directly against the real wired
pipeline, then goes further to exercise real (not-in-the-original-fixture)
multi-word sentences built from the same closed vocabulary — see the
honest-gap entries above for why that was necessary to surface the real
nsubj/dobj behavior.

`../../lib/language-engine/` is shared with `latin-language-algebra` and
`lakota-language-algebra`; its own correctness is exercised from all three
dies' `test/engine.test.mjs`, not by a test suite of its own. Both sibling
dies' own suites (`npm test` inside `services/latin-language-algebra/` and
`services/lakota-language-algebra/`) still pass in full, unchanged, after
this die started sharing the same engine location.

Discovery and admission are exercised for real by
`run-leader-movement.js`'s own `discoverAdvertisements`, `providerAdvertisement`,
and `invokeOperation` — see this die's seating record at
`content/micro-enterprises/tokipona-language-algebra.json`, validated
against the live `emsenn/schema/micro-enterprise` schema. Verified directly:
`discoverAdvertisements({ searchRoots: ["services"] })` from
`linguistics-services-section` finds all three dies (`latin-language-
algebra`, `lakota-language-algebra`, `tokipona-language-algebra`) with no
throw, and the full `solicit-service` → `invoke-service` CLI contract runs
end-to-end over real stdin/stdout JSON for `"mi wile moku e kili."`.
