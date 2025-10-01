---
title: "3. The Problem of Primitive Reference: A Pattern-Constellation Approach"
author: Florin Cojocariu
tags: ["reference-problem"]
lens: ["philosophy"]
status: "revised_draft"
date: 09.30.2025
---

# Abstract

This work examines Field's challenge to Tarski's semantic theory - that reducing truth to reference and satisfaction merely pushes the philosophical problem to unexplained semantic primitives. We propose that this challenge dissolves through the Pattern-Constellation (PC) framework, which reconceives reference as an internal linguistic operation $\mathcal{R}(x^c, x^o)$ grounded in experiential pattern-recognition events. By distinguishing experiential actualization $E(\{A\})$ from linguistic mediation $\exists(\{A, a^c\})$, we show that Field's problem rests on a category error: assuming reference must bridge word and world rather than coordinate experiential patterns through language. The framework is validated by recent findings in language model architectures revealing dual rod/cap structures that mirror the $x^o/x^c$ distinction.

# Introduction

## Motivating the project

Tarski's semantic theory provides formal scaffolding for truth, yet Hartry Field's objection (1972) persists: the T-schema shifts explanatory weight onto unanalyzed semantic primitives—reference and satisfaction—rather than explaining them. If truth reduces to reference, what explains reference? Subsequent theories (causal-historical, descriptivist, intentional/phenomenological) either posit primitive "hooks" connecting symbols to world, or trade one mystery for another through regress, circularity, or unexplained mental-world relations.

Two diagnoses precede our alternative:

1. **Category assumption.** Most debates assume reference is a *bridge* between qualitatively distinct kinds (linguistic tokens/concepts versus worldly entities/properties). The puzzle becomes: how to build that bridge.

2. **Phenomenological atomization.** Theories treat pattern and recognition as separable—a pattern exists, then cognition recognizes it. This atomizing move generates the explanatory gap Field highlights.

The Pattern-Constellation framework accepts Tarski's insight about truth-as-structure but rejects word-world bridge metaphysics. Goal: show that 'primitive-reference' demands arise from inappropriate decomposition, then provide naturalistic explanation of what does the work.

## The PC proposal

Reference is an internal linguistic operation coordinating two modes of a lexical form—its referential, experiential mode and its conceptual, linguistic mode—within a learned, distributed Pattern-Constellation. Elements traditionally appearing separate (pattern versus recognition; word versus world) are aspects of the same structured, learned system. Rather than positing extra-ontological hooks, PC locates explanatory work in multimodal learning dynamics and social transmission.

**Claims:** Reference emerges from histories of multimodal, recurrent encounters producing stable, distributed attractors (Pattern-Constellations). Coordination between conceptual use and referential activation is internal operation $\mathcal{R}(x^c, x^o)$ linking these modes.

**Non-claims:** PC doesn't deny external ecology or social practice—these causal and social factors build constellations. Computational models don't alone settle philosophical questions—empirical claims are explicitly labeled and testable.

### Notation & primitives

* $\{A\}$ **— Pattern-Constellation for type A.** Distributed, multimodal attractor of sensory, motor, affective and linguistic elements associated with a kind (e.g., $\{DOG\}$, $\{WATER\}$). Not abstract Platonic pattern but dispositional structure instantiated in neural/architectural dynamics.

* $E(\{A\})$ **— Experiential actualization.** Concrete event where $\{A\}$ constellation activates via perception, action, or affect. E captures pre-linguistic, lived pattern occurrence.

* $a^o$ **— referential/object-word mode.** Public, referential deployment of lexical form. $E(\{A, a^o\})$ marks experiences where word-form co-occurs with constellation, embedding via learning.

* $a^c$ **— conceptual/concept-word mode.** Abstract, linguistic, or propositional deployment of same lexical form. $\exists(\{A, a^c\})$ denotes conceptual/linguistic uses operating in abstracted realm (discourse, thought, counterfactuals).

* $\exists(\{...\})$ **— linguistic mediation operator.** Marks operations and patterns primarily in conceptual/linguistic domain (inference, communication about non-present items, syntactic manipulation).

* $\mathcal{R}(x^c, x^o)$ **— internal coordination operation (Reference).** Two-place operation internal to linguistic/practical system mapping conceptual deployments ($x^c$) to referential activations ($x^o$), bringing full $\{X\}$ constellation online.

* **PRU — Pattern-Recognition Unity.** Phenomenological claim: pattern and recognition are experientially indivisible. Recognizing isn't separate stage after pre-existing pattern but activation of indivisible experiential event $E(\{A\})$.

## Central hypothesis and roadmap

**Central claim.** Field's primitive-reference worry dissolves once we reject the bridge metaphor and accept reference as internal coordination operation ($\mathcal{R})$ between two modes of use embedded in learned pattern-constellations. What appears as need for "primitive hook" is, in PC, that recognition is primitive in experience: $E(\{A\})$ events are phenomenologically atomic starting points for naturalistic account.

**Roadmap.** §2 develops PC mechanics (learning dynamics, E/∃ distinction, neural implementation). §3 reinterprets causal, descriptivist, and intentional theories through PC lens. §4 dissolves Field's challenge with concrete examples. §5 examines $x^o/x^c$ distinction. §6-8 provide empirical validation and case studies. §9-10 explore philosophical implications.

# The Pattern Constellation Framework

## The Core Principle: PRU

Pattern-Recognition Unity asserts pattern and recognition constitute atomic experiential events. When you see a duck in the duck-rabbit illusion, there is no pattern "duck" that you then recognize—only the atomic event of duck-seeing.

Main argument: when $\{DUCK\}$ PC activates via partial entity (visual pattern), all other patterns in PC activate. What we call "recognition" is simply *reaction*—it's absurd to speak of recognition without reaction. In PC framework, reaction is part of $\{DUCK\}$ Pattern Constellation, not ulterior action. This leads directly to conclusion: pattern and recognition are unified entity.

In PC notation: $E(\{DUCK\})$ - experiential actualization of duck pattern-constellation.[^1]

By 'atomic' we mean experientially indivisible—not composed of separate pattern and recognition phases. Pattern exists only in its recognition, not as separate entity awaiting recognition.

### Defending PRU

**The stored-pattern objection**: Don't we store DUCK patterns independently of recognition? Memory contains patterns awaiting retrieval.

**Category error**: This assumes pattern-matching (serial search/retrieval) when recognition operates through pattern-recognition (parallel activation). Traditional AI searches templates sequentially—present input, compare against stored items, output match. Biological recognition activates entire constellations simultaneously.

**The encoding argument**: $\{DUCK\}$ exists as distributed network configuration—connection weights across sensory, motor, emotional, and linguistic nodes. No "duck photograph" exists separately. Visual Animal simulations with Hopfield networks demonstrate: you cannot locate where visual pattern is stored because visual neurons never fire in isolation. Pattern is real (measurable low-energy network state) but visual component isn't stored as separate entity—encoded in weights activating full constellation.

**Pre-linguistic recognition**: Cat recognizing mouse refutes stored-separate-pattern view. Cat has $\{MOUSE\}$ as integrated sensory-motor-emotional constellation, not conceptual representation plus recognition process. Recognition triggers hunting immediately—response patterns are part of what recognition is, not subsequent to it.

**Conceptual incoherence**: "Recognition without anything to recognize" makes no sense—but this means recognition requires simultaneous constellation activation, not pre-existing independent pattern waiting for discovery. Pattern exists only in its recognition as unified network state.

What appears as "stored pattern" is dispositional structure—connection weights producing coordinated activation when triggered. Storage is not of patterns but of pattern-producing configurations.

## From Pre-linguistic to Linguistic

Developmental path from pre-linguistic pattern recognition to linguistic reference proceeds through four stages (detailed in companion formalism document): $\{A\} \rightarrow \{A, a^o\} \rightarrow \{A, a^o, a^c\} \rightarrow \mathcal{R}(a^c, a^o)$. This grounds reference in experiential learning rather than primitive semantic relations.

## The E/∃ Distinction

Framework distinguishes two realms of pattern operation:

**E - Experiential Actualization**[^3]:
- Marks direct pattern-recognition events
- Pre-linguistic or with integrated labels
- Operates in NNs through Hopfield-like attractor states
- Grounded in sensory-motor-emotional patterns

**∃ - Linguistic Mediation**:
- Marks conceptual/abstract linguistic use
- Can operate detached from immediate experience
- Enables communication about absent things
- Creates linguistic pattern constellations (LPCs)

Fundamental transition $E(\{A, a^o\}) \rightarrow \exists(\{A, a^c\})$ captures move from sensory-grounded to conceptual functioning.[^4]

## Neural Implementation

One way to model pattern-constellations: Hopfield networks with Hebbian learning[^5]:
- Patterns that co-occur wire together
- Form unified attractor basins
- Activated as wholes by partial patterns
- $a^o$ embeds in constellation through repeated $E(\{A, a^o\})$ events

Simple Python model with 256 neurons (designated: sensing, motor, feeling, linguistic) shows how PC forms as unified pattern in entire network. When presented with visual pattern, network fires all neurons, not only visual ones.

Multiple pieces of evidence from neurological studies show similar brain behavior (motor neurons firing when we see ball or hear "kick!").[^2]

# Traditional Theories of Reference Through PC Lens

## The Shared Assumption

All major reference theories share assumption PC framework rejects: patterns exist independently of recognition[^6], creating gap reference must bridge. This generates pseudo-problems about connecting internal representations to external patterns.

## Theory-Specific Reanalysis

**Causal Theories**: Assume patterns in world causally imprint on minds.

PC response: Causation links E events, not abstract patterns. Pattern $\{WATER\}$ doesn't cause anything—specific $E(\{WATER, water^o\})$ events do.

**Description Theories**: Treat patterns as feature bundles awaiting recognition.

PC response: Features themselves are patterns requiring E events, generating infinite regress unless grounded in atomic $E(\{A\})$ events.

**Intentional Theories**: Posit consciousness directed at external patterns.

PC response: Intentionality itself is $E(\{A\})$ event unified with its object, not bridge between domains.

## Fodor's Language of Thought

Fodor's LOT exemplifies what PC rejects: internal symbolic tokens requiring connection to external properties. His atomistic semantics—primitive concepts getting content through bare causal connections—generates precisely the 'hooking' relation creating Field's regress.

PC alternative: No internal symbols needing external connections. Instead, $\{A, a^o, a^c\}$ constellations where $a^o$ grounds through $E(\{A, a^o\})$ events and $a^c$ enables $\exists(\{A, a^c\})$ operations.

# Dissolving the Reference Problem

## The Dissolution Strategy

PC framework doesn't solve reference problem but dissolves it by showing it rests on false presuppositions. Reference isn't word-world connection but internal linguistic operation:

**$\mathcal{R}(x^c, x^o)$** where:
- $x^c$ operates in ∃ realm (conceptual mode)
- $x^o$ operates in E realm (referential mode)
- $x^o \in \{X, x^o, x^c\}$ (embedded in constellation)
- $\{X\}$ built through $E(\{X, x^o\})$ events

When R operates, $x^o$ activates full $\{X\}$ constellation including all sensory-motor-emotional patterns learned through experience.

Traditional problem: How does "dog" connect to dogs?

PC answer:

1. $\{DOG\}$ forms through $E(\{DOG\})$ events (pre-linguistic)
3. $dog^o$ integrates via $E(\{DOG, dog^o\})$ (Hebbian learning)
4. $dog^c$ emerges for $\exists(\{DOG, dog^c\})$ uses (abstract thought)
5. $\mathcal{R}(dog^c, dog^o)$ coordinates between modes
6. $dog^o$ activates full $\{DOG\}$ constellation

No gap to bridge—just internal coordination grounded in experiential history.

## Field's Translation Problem

**German speaker**:

$\{DEUTSCHLAND, deutschland^o, deutschland^c\}$

Built through $E(\{DEUTSCHLAND, deutschland^o\})$ events:
- Geographic: central European location, familiar landscapes
- Cultural: home language, local customs
- Emotional: homeland feelings, identity
- Social: family, government
- Linguistic: $deutschland^o$, heimat, vaterland

Reference: $\mathcal{R}(deutschland^c, deutschland^o)$ — "What does 'Deutschland' refer to?" → $\{DEUTSCHLAND\}$ via $deutschland^o$

**English speaker**:

$\{GERMANY, germany^o, germany^c\}$

Built through $E(\{GERMANY, germany^o\})$ events:
- Geographic: central European location, maps
- Cultural: foreign associations, observed customs
- Emotional: foreign country, historical knowledge
- Social: diplomatic relations, tourism
- Linguistic: $germany^o$, german, deutschland

Reference: $\mathcal{R}(germany^c, germany^o)$ — "What does 'Germany' refer to?" → $\{GERMANY\}$ via $germany^o$

**Why translation works**:

$\{DEUTSCHLAND\} \approx \{GERMANY\}$

Substantial overlap in underlying E events:
- Same geographic region experienced/learned about
- Same institutional structures
- Same visual landmarks

Different in emotional/cultural E events:
- Insider vs outsider experiences
- Native vs foreign language associations

Translation succeeds: $overlap(\{DEUTSCHLAND\}, \{GERMANY\}) >$ threshold

**Why 'Bertrand Russell' fails**:

$\{DEUTSCHLAND\}$ vs $\{RUSSELL\}$

$E(\{DEUTSCHLAND, deutschland^o\})$: geographic, political experiences

$E(\{RUSSELL, russell^o\})$: human, biographical experiences

Minimal overlap—completely different pattern types. Cannot coordinate.

## Complete Grounding Chain

Field argued Tarski reduces truth to unexplained primitives (reference, satisfaction). In Tarski's T-schema:

"Snow is white" is true iff snow is white

Field asks: What grounds right-hand side's reference to snow?

**PC response**:

Right-hand side decomposes as:

**Predication level**: $\mathcal{P}(white^c, snow^o)$
- $white^c$ operates conceptually
- $snow^o$ provides referential target

**Reference level**: $\mathcal{R}(snow^c, snow^o)$
- Answers "what does 'snow' refer to?"
- $snow^o \in \{SNOW, snow^o, snow^c\}$
- $\{SNOW\}$ includes all sensory patterns from $E(\{SNOW, snow^o\})$ events

**Complete grounding chain**:

$$E(\{SNOW\}) \rightarrow E(\{SNOW, snow^o\}) \rightarrow \exists(\{SNOW, snow^c\}) \rightarrow \mathcal{R}(snow^c, snow^o)$$

No primitive reference—just developmental sequence from experiential to linguistic.

**Why Field's problem dissolves**:

Field's challenge assumes reference must be primitive relation connecting words to world. PC shows:

1. Reference is $\mathcal{R}(x^c, x^o)$—internal linguistic coordination
2. Grounding comes through $x^o \in \{X, x^o, x^c\}$
3. $\{X\}$ built through $E(\{X, x^o\})$ events
4. No mysterious primitive—just Hebbian learning + Hopfield dynamics

Demand for primitive reference is like demanding primitive space-time connections after accepting relativity—assumes separation that doesn't exist.

# The $x^o/x^c$ Distinction

## Two Modes of Word Function

PC framework reveals words operate in two distinct modes:

**$x^o$ (object-word mode)**:
- Referential, grounded in E realm
- Tight clustering in embedding space ("rods")
- Built through $E(\{X, x^o\})$ events
- Activates full $\{X\}$ constellation

**$x^c$ (concept-word mode)**:
- Abstract, operates in ∃ realm
- Diffuse in embedding space ("caps")
- Enables logical/mathematical operations
- Participates in linguistic pattern constellations $\langle\langle x \rangle\rangle$

## Gradient Rather Than Binary

Distinction is gradient. "Cat" has strong $x^o$ grounding through $E(\{CAT, cat^o\})$ events. "Democracy" operates primarily in $x^c$ mode through $\exists(\{DEMOCRACY, democracy^c\})$ with minimal E grounding. Most words exhibit both modes to varying degrees.

# Empirical Validation: Language Models

## The Rod/Cap Discovery

Analysis of large language model embeddings reveals dual structure:
- **Linguistic rods**: Tight clusters encoding $x^o$-like referential functions
- **Semantic caps**: Diffuse manifolds encoding $x^c$-like conceptual operations

This structure emerged without explicit programming, suggesting $x^o/x^c$ distinction reflects deep computational requirements of language processing.

## LLMs as Pure ∃ Systems

LLMs operate entirely in ∃ realm—they have no $E(\{A\})$ events, only $\exists(\{A, a^c\})$ operations. They possess:
- All cap, no rod (in human terms)
- $x^c$ functionality without $x^o$ grounding
- Formal R operations without experiential basis

Yet they achieve reference-like behavior, suggesting reference is fundamentally about pattern coordination rather than consciousness or "grounding" in traditional sense.

## Validation of Pattern Coordination

LLMs demonstrate reference phenomena can emerge from pure pattern coordination without:
- Consciousness or experiential grounding
- Causal connections to external objects
- Internal representations "about" things

This supports PC view: reference is systematic pattern correspondence, not word-world connection.

# Tarski's T-Schema Revisited

Traditional statement: "Snow is white" is true iff snow is white

Field's problem: Right side is "just more words"—where's reality?

## PC Analysis: Predication Level

Left side is: $\mathcal{P}(white^c, snow^c)$ - predication.

$\mathcal{P}(white^c, snow^c)$ means:
- Using white-concept to characterize snow
- $white^c$ operates in $\exists(\{WHITE, white^c\})$
- $snow^c$ embedded in $\{SNOW, snow^o, snow^c\}$
- When $\mathcal{P}$ operates, $snow^c$ activates full $\{SNOW\}$, including $snow^o$

## PC Analysis: Reference Level

But what does "snow" refer to? Answer: $\mathcal{R}(snow^c, snow^o)$

$\mathcal{R}(snow^c, snow^o)$ where $snow^o \in \{SNOW, snow^o, snow^c\}$

$\{SNOW\}$ formed through $E(\{SNOW, snow^o\})$ events:
- Visual: white, crystalline, reflective
- Tactile: cold, wet, granular
- Motor: scooping, throwing, building
- Emotional: winter associations
- Linguistic: $snow^o$, $snow^c$

When $\mathcal{R}(snow^c, snow^o)$ operates:
- $snow^c$ (∃ realm) coordinates with $snow^o$ (E realm grounding)
- $snow^o$ activates entire $\{SNOW\}$ constellation
- All sensory patterns from $E(\{SNOW, snow^o\})$ become active
- This is the grounding

So "Snow is white" is true iff snow is white can be written as:

$$\mathcal{P}(white^c, snow^c) \iff white^o \in \{SNOW\}$$

$white^o$ is, however, special "object" like all properties: while it has direct phenomenological perception (and in this sense is object) its manifestation isn't bounded by time or space.

# Case Studies

## Indexicals & Demonstratives (Kaplan: "I", "here", "that")

**Puzzle.** Indexicals and demonstratives shift reference with context: "I" picks out speaker, "here" speaker's location, demonstrative plus pointing picks out indicated object. Any reference account must explain this rapid context-dependence and apparent directness of ostension.

**Standard worry.** Context-sensitivity seems to demand primitive direct-reference mechanism or special bridging relation connecting token-use to immediate context. Purely internalist or purely descriptivist accounts struggle to capture both immediacy and systematicity.

**PC diagnosis.** Demonstratives and indexicals are prototypical cases where $E(\{A, a^o\})$ is literally immediate, multimodal event: pointing gesture + perceptual contact + deictic embedding. In PC terms:

- Demonstrative token is $a^o$ deployment tightly coupled to current E-event (pointing + perception)
- $\mathcal{R}(a^c, a^o)$ is highly context-sensitive: mapping parameterized by situational cues (speaker identity, spatio-temporal coordinates, gestural vector)
- Because E-events instantiate full $\{A\}$ attractor in situ, reference feels direct: constellation brought online by co-occurrence of perceptual, motor, and linguistic cues

**Upshot.** Indexicality isn't mystical primitive but case of extreme local weighting in E/∃ dynamics: certain contextual cues dominate attractor selection process and constrain R operation to map $a^c$ tokens to locally instantiated $a^o$.

**Empirical signature.** PC predicts systematic variability in demonstrative resolution depending on multimodal cue strength. Experimental manipulations weakening contextual cues (e.g., occluding gesture, temporal delay) should increase reliance on $a^c$-level inferencing (descriptive resolution) and produce measurable delays or errors in referent selection.

## Empty Names and Fiction (Meinong/fictional names)

**Puzzle.** Names apparently lacking real-world referents ("Sherlock Holmes", "Pegasus") nonetheless have cognitive and communicative uses: we ascribe properties, tell stories, make true/false claims relative to fictional frameworks. How do such names bear meaning without worldly object?

**Standard worry.** Theories tying meaning to real-world causal baptism or direct reference struggle: empty name has no historical referent to hook onto. Descriptivist accounts accommodate some uses but face circularity and variation in fictional practice.

**PC diagnosis.** Fictional and empty names instantiate ∃-heavy pattern-constellations: rich $a^c$ structure with sparse or counterfactual $a^o$ embedding.

- Authors and audiences build and stabilize $\{FICTIONAL\}$ constellations via repeated imaginative E/∃ activity (narrative immersion, role-play, rehearsal). These constellations have internal coherence (causal/temporal relations, property bundles) even without stable external E-events tied to worldly objects
- $a^o$ slot is weakly or hypothetically filled (counterfactual E patterns, imagined percepts) so $\mathcal{R}(a^c, a^o)$ typically invokes internally generated activations rather than externally triggered ones
- This explains how fictional names support internal consistency, counterfactual reasoning, and intra-fiction truth conditions while lacking worldly baptismal grounding

**Upshot.** Empty names aren't meaningless gaps but targets of intense ∃-practice instantiating stable conceptual attractors usable in thought and communication. Difference between fictional and real names is difference in E/∃ weightings, not in kind.

**Empirical signature.** PC predicts engagement intensity (measured by physiological markers of immersion, frequency of narrative rehearsal, or linguistic co-occurrence statistics) correlates with coherence and accessibility of fictional constellations. Neurocognitive studies should show overlap between activations for vividly imagined E patterns and $a^c$ activations when users process fictional names.

## Vagueness and the Sorites Paradox

**Puzzle.** Predicates like "heap", "bald", or "tall" admit borderline cases and paradoxical reasoning (sorites). Classical bivalence seems ill-fitted: adding one grain doesn't change "heap" status, but repeated applications lead to contradiction.

**Standard worry.** Accounts seeking crisp extensions face either arbitrariness (where to draw line) or paradoxical consequences. Semantic theories propose supervaluation, degrees, or contextualism, but each has costs.

**PC diagnosis.** Vagueness arises naturally from graded attractor landscapes and fuzzy basin boundaries in pattern-constellations:

- $\{HEAP\}$ is attractor with broad, shallow basin; partial cues (number of grains, arrangement) produce graded activation levels rather than binary on/off retrieval
- Borderline cases correspond to low-confidence activations where no single basin dominates. $\mathcal{R}(a^c, a^o)$ returns weak or probabilistic access to $\{HEAP\}$ constellation
- Sorites construction exploits incremental changes that individually produce negligible changes in activation but cumulatively move system across basins—natural dynamical phenomenon without paradoxical metaphysical commitments

* Authors and audiences build and stabilize ${FICTIONAL}$ constellations via repeated imaginative E/∃ activity (narrative immersion, role-play, rehearsal). These constellations have internal coherence (causal/temporal relations, property bundles) even without stable external E-events tied to worldly objects, because the LPCs are embeded in creates the coherence.
* The $a^o$ slot is weakly or hypothetically filled (counterfactual E patterns, imagined percepts) so $\mathcal{R}(a^c,a^o)$ typically invokes internally generated activations rather than externally triggered ones.
* This explains how fictional names support internal consistency, counterfactual reasoning, and intra-fiction truth conditions while lacking worldly baptismal grounding.

**Upshot.** Empty names are not meaningless gaps but targets of intense $\exists$-practice that instantiate stable conceptual attractors usable in thought and communication. The difference between fictional and real names is a difference in $E$/$\exists$ weightings, not in kind.

**Empirical signature.** PC predicts that engagement intensity (measured by physiological markers of immersion, frequency of narrative rehearsal, or linguistic co-occurrence statistics) correlates with the coherence and accessibility of fictional constellations. Neurocognitive studies should show overlap between activations for vividly imagined $E$ patterns and the $a^c$ activations when users process fictional names.

***

### 8.3 Vagueness and the sorites paradox

**Puzzle.** Predicates like “heap”, “bald”, or “tall” admit borderline cases and admit paradoxical reasoning (sorites). Classical bivalence seems ill-fitted: adding one grain doesn’t change “heap” status, but repeated applications lead to contradiction.

**Standard worry.** Accounts that seek crisp extensions face either arbitrariness (where to draw the line) or paradoxical consequences. Semantic theories propose supervaluation, degrees, or contextualism, but each has costs.

**PC diagnosis.** Vagueness arises naturally from graded attractor landscapes and fuzzy basin boundaries in pattern-constellations:

* $\{HEAP\}$ is an attractor with a broad, shallow basin; partial cues (number of grains, arrangement) produce graded activation levels rather than binary on/off retrieval.
* Borderline cases correspond to low-confidence activations where no single basin dominates. $\mathcal{R}(a^c,a^o)$ returns weak or probabilistic access to the $\{HEAP\}$ constellation.
* The sorites construction exploits incremental changes that individually produce negligible changes in activation but cumulatively move the system across basins — a natural dynamical phenomenon without paradoxical metaphysical commitments.

**Upshot.** Instead of forcing sharp line, PC models vagueness as feature of graded neural/representational dynamics: predicates implemented by attractors of varying sharpness, and borderlineity expected where basins overlap or are shallow.

**Empirical signature.** PC predicts (a) judgments in borderline cases show higher reaction-time and lower confidence, (b) perceptual/contextual priming can shift activation reliably across threshold, and (c) training amplifying certain diagnostic cues will sharpen attractor basins and reduce borderlineity. Psychophysical experiments measuring continuous activation proxies should match attractor predictions.

# Language as Pattern Coordination System

## Not Bridge but Dance

Language doesn't bridge between mind and world. It coordinates E and ∃ realms through $x^o/x^c$ distinction. Like dancers responding to shared music, speakers coordinate their $E(\{A, a^o\})$ experiences through $\exists(\{A, a^c\})$ operations.

## Linguistic Pattern Constellations

Beyond primitive PCs, language creates second-order patterns:

**$\langle\langle a \rangle\rangle$ - Linguistic Pattern Constellations**:
- Patterns of how words behave in $\exists$ realm
- Enable mathematical/logical thought
- ">" functions as $x^o$ for $\langle\langle comparison \rangle\rangle$
- Grounded ultimately in $E$ events through long chains

## Success Without Mystery

Linguistic coordination succeeds through:
1. Shared neural architecture producing similar $\{A\}$ structures
2. Overlapping $E(\{A, a^o\})$ experiences during learning
3. $\exists(\{A, a^c\})$ operations achieving sufficient overlap
4. Continuous mutual adjustment through communication

No mysterious semantic primitives required.

# Philosophical Implications

## Predication, Reference, and Truth

**Predication**: $\mathcal{P}(x^c, y^o)$ where $x \neq y$
- Saying something about y using concept x
- Both grounded through their respective E histories
- "Snow is white" = $\mathcal{P}(white^c, snow^o)$

**Reference**: $\mathcal{R}(x^c, x^o)$
- Same word coordinating modes
- Answers "what does x refer to?"
- Picks out $\{X\}$ constellation built through $E(\{X, x^o\})$

Both ultimately grounded in E realm.

**Truth as Collective Construct**

From E → ∃ structure:

Individual: $E(\{X, x^o\})$ builds $\{X, x^o, x^c\}$

Collective: $\exists(\{X, x^c\})$ coordinates between individuals

Truth emerges when:
- Individual PCs (built through E) achieve stable coordination (through ∃)
- $\mathcal{R}(x^c, x^o)$ operations align across speakers
- Outlier $E(\{X, x^o\})$ patterns fail to coordinate via ∃
- Language "flattens" errors through coordination failures

Truth = patterns stabilized through collective ∃ coordination of individually grounded E experiences.

## Sellars and Recognition Content

**The Cat and the Mouse**

Pre-linguistic:

$\{MOUSE\}$ in cat's brain built through $E(\{MOUSE\})$ events:
- Visual: small, moving, mouse-shaped
- Olfactory: mouse scent
- Motor: hunting patterns
- Emotional: excitement, predatory arousal

Cat: $E(\{MOUSE\}) \rightarrow$ recognition $\rightarrow$ hunting

No $\exists(\{MOUSE, mouse^c\})$—no linguistic mediation

No $mouse^o$ or $mouse^c$—no label or concept

Pure pattern-recognition.

**This is recognition without episteme**:
- Cat has real pattern-discrimination
- Can distinguish $\{MOUSE\}$ from $\{FROG\}$
- But no ∃ realm—no linguistic/conceptual mediation
- No justified belief—no "space of reasons"

**Answers Sellars**:

Sellars: No epistemic content without concepts ✓ Correct

But: Recognition content exists pre-linguistically ✓ Also correct

Cat: $E(\{MOUSE\})$ without $\exists(\{MOUSE, mouse^c\})$

Child: $E(\{DOG, dog^o\})$ and later $\exists(\{DOG, dog^c\})$

Recognition precedes episteme. E precedes ∃. $x^o$ precedes $x^c$.

**Distinguish types of content**:

Epistemic content (Sellars right):
- Requires ∃ realm (linguistic/conceptual)
- Requires $\exists(\{A, a^c\})$ and $\mathcal{R}(a^c, a^o)$ operations
- Justified belief needs "space of reasons" and language
- Cat cannot have this

Recognition content (PCs right):
- $E(\{A\})$ or $E(\{A, a^o\})$ realm
- Pre-linguistic pattern-recognition
- Real discrimination without ∃
- Cat has this: $E(\{MOUSE\})$

Developmental story: $E(\{A\}) \rightarrow E(\{A, a^o\}) \rightarrow \exists(\{A, a^c\}) \rightarrow \mathcal{R}(a^c, a^o) \rightarrow$ Episteme

E precedes ∃ precedes episteme. Recognition precedes conceptualization.

## Normativity Without Correspondence

From Hopfield dynamics + E/∃ structure:

Correctness = stable attractor from E events

Error = wrong attractor basin from insufficient E data

Correction = more E data → transition to different attractor

Collective normativity:
- Individual $E(\{X, x^o\})$ events vary
- $\exists(\{X, x^c\})$ coordination reveals outliers
- Failed ∃ coordination → correction pressure
- Convergence through repeated E/∃ cycles

No objective arbiter needed. But real constraints:
- Attractor stability (E realm)
- Coordination success (∃ realm)
- Collective convergence (E/∃ interaction)

# Conclusion

PC framework dissolves Field's challenge by reconceiving reference entirely. Rather than primitive relation connecting words to world, reference is $\mathcal{R}(x^c, x^o)$—internal linguistic operation coordinating between conceptual and referential modes, grounded through pattern-constellations built from experiential events.

This isn't merely theoretical exercise. Framework:
- Explains the rod/cap structure in language models
- Accounts for referential success without semantic primitives
- Unifies diverse phenomena under pattern-coordination principles
- Suggests new research directions in linguistics and AI

Like shift from absolute to relative spacetime, PC framework doesn't solve old problems but reveals them as artifacts of incorrect assumptions. Reference isn't primitive because it isn't connective—it's systematic correspondence between experiential and linguistic pattern-recognition events.

## Research Directions

PC paradigm opens concrete research paths:

1. **Developmental**: How do $\{A\} \rightarrow \{A, a^o\} \rightarrow \{A, a^o, a^c\}$ transitions occur in children?
2. **Computational**: Can we build systems with explicit E/∃ architectures?
3. **Cross-linguistic**: How do different languages create different $\langle\langle a \rangle\rangle$ structures?
4. **Philosophical**: What other "primitive" relations might dissolve under pattern analysis?

[^1]: Most probable learning mechanism for biological neural networks is Hebbian: what fires together, wires together. In application of Hebbian learning to Hopfield Networks, once trained such network can retrieve full pattern from partial cue. In $\{DUCK\}$ case, either head shape or "quack" or funny walk—all partial patterns of entire PC $\{DUCK\}$—presence of one activates entire PC.

[^2]: There is ample evidence that all infants, when learning words naming objects, tend to grab them, showing how motor areas are integrated with language areas and the need to _sense_ the object more closely and directly. The name is a label for sensory and motor experiences.
[^3]: Experiential actualization E does not need language at all. It is present in animals, but it is also the lived pre-linguistic mystery at the core of modern phenomenology.
[^4]: This is a complicated and lengthy process in humans, which, by all data available, finishes well over the age of 18.
[^5]: By no means is this the only model possible, but it is the most efficient of what we have now. Hopfield networks are few-shots learners and, once trained, are remarkably effective.
[^6]: This may be a subject in itself, but for our purposes it is enough to say that if the sensing pattern and the reaction pattern (which signifies “recognition”) are both parts of a unified PC, then the idea of a pattern without recognition does not make too much sense. One can go through the realism/anti-realism debate rabbit hole, but the approach here is more naturalistic and pragmatic: PCs are not abstract entities but real patterns in neural networks. Funny enough, we cannot make out where the visual pattern is inside a PC because visual neurons never fire in isolation. So, while a PC pattern in a NN is real, its visual component is elusive. Simply said, I cannot find in a NN where the dog image or the dog sound are saved, but I can find easily the entire {DOG} PC.
[^7]: What most famous language puzzles ignore is the _learning_ part. Almost all consider language as a given, abstract collection of tokens governed by abstract rules that we try (and partially succeed) to decode. What PC makes clear is that learning is essential in how language works, and learning is not an exclusively abstract process but is grounded in reality by Pattern Constellations. The way {WATER} is learned on twin Earths is crucial.

