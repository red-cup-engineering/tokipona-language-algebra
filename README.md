# @lenticule-science/tokipona-language-algebra

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

Toki Pona's language fiber: structural-particle lexicon, isolating morphology,
reference, SVO attachment and segmentation data, plus a directly invocable
tagging die.

The package owns Toki Pona data. `@lenticule-science/communicating@0.0.3` owns
the language-neutral Mark admission, articulation, charged parse, role and
cohomology machinery. `./tag` composes those public readings with this bundle;
it does not import a private section engine. Activity and request IDs preserve
the established SCIS v2 `objectKind`/`value`/empty-`witnessRoot` law.

Exports:

- `.` and `./bundle`: the immutable raw Toki Pona bundle
- `./tag`: compiled bundle, word tagging, tokenization and full-text readings
- `solicit-service` and `invoke-service`: ActivityStreams process faces

Established limits remain explicit. With no inflectional suffix rules, content
words honestly fall to the noun floor; no ordinary word anchors a verb relation.
A preverb such as `wile` can therefore attach the true verb as a nominal object
before reaching the true object. The tests retain both the visible obstruction
and the confidently wrong glued reading.

```sh
npm run check
npm run build
npm test
```

The release closure contains no linguistics-root, legacy RMN runtime or RDF
projection dependency.

## Earlier work
- `lib/legacy/2026-08-03-tokipona-language-algebra`: Earlier tokipona language algebra. Origin: 561-group/bare-cedar-fog `services/lenticule-science/services/linguistics-services-section/services/tokipona-language-algebra`, restored from commit 63b7ba4 on 2026-08-03.
