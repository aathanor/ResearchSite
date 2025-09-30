---
title: "The Problem of Primitive Reference: A Pattern-Constellation Approach"
author: Florin Cojocariu
tags: ["reference-problem"]
lens: ["philosophy"]
status: "first_draft"
date: 09.30.2025
---

# The Problem of Primitive Reference: A Pattern-Constellation Approach

## Abstract

This work examines Field's challenge to Tarski's semantic theory - that reducing truth to reference and satisfaction merely pushes the philosophical problem to unexplained semantic primitives. We propose that this challenge dissolves through the Pattern-Constellation (PC) framework, which reconceives reference as an internal linguistic operation R(x^c, x^o) grounded in experiential pattern-recognition events. By distinguishing experiential actualization E({A}) from linguistic mediation ∃({A, a^c}), we show that Field's problem rests on a category error: assuming reference must bridge word and world rather than coordinate experiential patterns through language. The framework is validated by recent findings in language model architectures revealing dual rod/cap structures that mirror the x^o/x^c distinction.

# 1. Introduction

## 1.1 Motivating the project: Why primitive reference remains a problem

Tarski’s semantic theory (and the T-schema in particular) gives us a valuable formal scaffold for talking about truth. Yet Hartry Field’s objection (1972) presses a persistent meta-question: the T-schema appears to shift explanatory weight onto unanalyzed semantic primitives — reference and satisfaction — rather than dissolve them. If truth is explained in terms of reference, what in turn explains reference? Subsequent families of theories (causal-historical, descriptivist/cluster, and intentional/phenomenological) each attempt to supply that explanation, but they leave a puzzling residue: they either posit a primitive ‘‘hook’’ connecting symbols to the world, or they trade one mystery for another (regress, circularity, or an unexplained mental–world relation).

Two diagnoses are worth emphasizing before we offer our alternative.

1.  **Category assumption.** Most debates assume that reference is a *bridge* between two qualitatively distinct kinds of things (linguistic tokens/concepts on the one hand; worldly entities/properties on the other). The philosophical puzzle is then framed as how to build that bridge.
2.  **Phenomenological atomization.** Many theoretical moves implicitly treat pattern and recognition as separable: a pattern exists, then a cognitive faculty recognizes it. This atomizing move produces the very explanatory gap Field highlights.

The Pattern-Constellation framework accepts Tarski’s insight about truth-as-structure but challenges the presupposed metaphysics of a word–world bridge. The project’s goal is modest and precise: show that the ‘primitive-reference’ demand is an artifact of an inappropriate decomposition, and then provide a candidly naturalistic account of what plays the explanatory role.

## 1.2 The PC proposal in a sentence

Reference is an internal linguistic operation that coordinates two modes of a lexical form—its referential, experiential mode and its conceptual, linguistic mode—within a learned, distributed Pattern-Constellation. Crucially, the elements that traditionally appear as separate (pattern vs recognition; word vs world) are here aspects of the same structured, learned system. Far from positing an extra-ontological hook, PC locates explanatory work in the dynamics of multimodal learning and social transmission.

### What the proposal *does* and *doesn't* claim

*   **Does claim:** Reference emerges from histories of multimodal, recurrent encounters that produce stable, distributed attractors (Pattern-Constellations). The coordination between conceptual use and referential activation is an internal operation R(x^c, x^o) that manipulatively links these modes.
*   **Does not claim:** PC does not deny the role of external ecology or social practice; rather, these causal and social factors are part of the histories that build constellations. Nor does PC claim that computational models alone settle all philosophical questions — empirical claims are explicitly labeled and testable.

***

### Notation & primitives (quick guide)

To avoid ambiguity, the following symbols and technical terms are used throughout the paper.

*   `{A}`** — Pattern-Constellation for type A.** A distributed, multimodal attractor of sensory, motor, affective and linguistic elements associated with a kind or type (e.g., `{DOG}`, `{WATER}`). Not an abstract Platonic pattern but a dispositional structure instantiated in neural/architectural dynamics.
*   `E({A})`** — Experiential actualization.** A concrete event in which the `{A}` constellation is activated by perception, action, or affect (seeing, touching, tasting, acting). `E` captures the pre-linguistic, lived occurrence of a pattern.
*   `a^o`** — referential / object-word mode.** The public, referential deployment of a lexical form (the ‘object-word’ reading). `E({A, a^o})` marks experiences in which the word-form co-occurs with the constellation and becomes embedded in it via learning.
*   `a^c`** — conceptual / concept-word mode.** The abstract, linguistic, or propositional deployment of the same lexical form (the ‘concept-word’ reading). `∃({A, a^c})` denotes conceptual/linguistic uses that operate in the abstracted realm (discourse, thought, counterfactuals).
*   `∃({...})`** — linguistic mediation operator.** Marks operations and patterns that primarily belong to the conceptual/linguistic domain (inference, communication about non-present items, syntactic manipulation).
*   `R(x^c, x^o)`** — internal coordination operation (Reference).** A two-place operation internal to the linguistic/practical system that maps conceptual deployments (`x^c`) to referential activations (`x^o`) and, in doing so, brings the full `{X}` constellation online.
*   `PRU`** — Pattern-Recognition Unity.** The phenomenological claim that pattern and recognition are experientially indivisible: recognizing is not a separate stage after a pre-existing pattern but the activation of an indivisible experiential event `E({A})`.

***

## 1.3 Central research hypothesis and roadmap

**Central claim.** Field’s primitive-reference worry dissolves once we reject the bridge metaphor and accept that reference is an internal coordination operation (R) between two modes of use embedded in learned pattern-constellations. What appears as a need for a ‘‘primitive hook’’ is, in PC, the fact that recognition is primitive in experience: `E({A})` events are taken as phenomenologically atomic starting points for a naturalistic account.

**Roadmap.** After setting these primitives, §2 develops the PC mechanics (learning dynamics, E/∃ distinction, neural motifs). §3 reinterprets causal, descriptivist, and intentional theories through the PC lens. §4 argues that PC dissolves Field’s formal worry and supplies testable empirical predictions (§6–§7 sketch computational and developmental validations). The conclusion (§10) sketches philosophical payoffs and research directions.


## 2. The Pattern Constellation Framework

### 2.1 The Core Principle-PRU

Pattern-Recognition Unity asserts that pattern and recognition constitute, together, atomic experiential events. When you see a duck in the duck-rabbit illusion, there is no pattern "duck" that you then recognize—there is only the atomic event of duck-seeing. 

The main argument is that when a {DUCK} PC is activated by its partial entity, which is the visual pattern, all other patterns in the PC are activated. What we call "recognition" is simply a _reaction_, it is absurd to speak of recognition without reaction. In the PC framework, the reaction is part of the {DUCK} Pattern Constellation, not an ulterior action, and this leads directly to the conclusion that pattern and recognition are in fact a unified entity.

In PC notation we'll symbolize the activation of the PC for a duck as E({DUCK}) - the experiential actualization of the duck pattern-constellation.[^1]

By 'atomic' we mean experientially indivisible—not composed of separate pattern and recognition phases. The pattern exists only in its recognition, not as a separate entity awaiting recognition.

### 2.2 From Pre-linguistic to Linguistic

The PC framework captures the developmental path from pure pattern-recognition to linguistic reference:

**Stage 1: Pre-linguistic** 

```
{A} - Pure pattern-constellation
E({A}) - Direct pattern-recognition events for A
No linguistic component
Example: Cat experiencing {MOUSE}
```

**Stage 2: Word-object (label) Integration**

```
{A, a^o} - Label integrated through Hebbian learning
E({A, a^o}) - Experience with linguistic label
Word fires with sensory patterns
Example: Child experiencing {DOG, dog^o}
```
[^2]

**Stage 3: Dual Functionality**

```
{A, a^o, a^c} - Same word, two modes
E({A, a^o}) - Grounded experience (x^o mode)
∃({A, a^c}) - Abstract linguistic use (x^c mode)
Example: Adult with full {DOG, dog^o, dog^c}
```
(word-concepts (like dog^c), are in their turn labels for patterns of use; dog^c designates all the ways I can use the word dog based on my real and textual experiences)

**Stage 4: Reference Proper**

```
R(a^c, a^o) - Coordination between modes
Answers "what does 'a' refer to?"
Meta-linguistic capability
```
(this will be explained more thoroughly below)

### 2.3 The E/∃ Distinction

The framework distinguishes two realms of pattern operation:

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

The fundamental transition E({A, a^o}) → ∃({A, a^c}) captures the move from sensory-grounded to conceptual functioning.[^4]

### 2.4 Neural Implementation

One way to model pattern-constellations is to see them as Hopfield networks with Hebbian learning [^5]:

- Patterns that co-occur wire together
- They form unified attractor basins
- They are activated as wholes by partial patterns
- a^o embeds in constellation through repeated E({A, a^o}) events

A simple Python model of such a network with 256 neurons, designated as having different functionality (sensing, motor, feeling, linguistic), shows how a PC forms as a unified pattern in the entire network. However, when presented with the visual pattern, such a network fires all the neurons, not only the visual ones.

There are multiple pieces of evidence from neurological studies that a similar thing happens in our brains (like motor neurons firing when we see a ball or we hear “kick!”)

## 3. Traditional Theories Through PC Lens

### 3.1 The Shared Assumption

All major theories of reference share an assumption the PC framework rejects: that patterns exist independently of recognition[^6], creating a gap reference must bridge. This generates pseudo-problems about connecting internal representations to external patterns.

### 3.2 Theory-Specific Reanalysis

**Causal Theories**: Assume patterns in the world causally imprint on minds. PC response: Causation links E events, not abstract patterns. The pattern {WATER} doesn't cause anything - specific E({WATER, water^o}) events do.

**Description Theories**: Treat patterns as feature bundles awaiting recognition. PC response: Features themselves are patterns requiring E events, generating infinite regress unless grounded in atomic E({A}) events.

**Intentional Theories**: Posit consciousness directed at external patterns. PC response: Intentionality itself is an E({A}) event unified with its object, not a bridge between domains.

### 3.3 Fodor's Language of Thought

Fodor's LOT exemplifies what PC rejects: internal symbolic tokens requiring connection to external properties. His atomistic semantics - primitive concepts getting content through bare causal connections - generates precisely the 'hooking' relation that creates Field's regress.

PC alternative: No internal symbols needing external connections. Instead, {A, a^o, a^c} constellations where a^o grounds through E({A, a^o}) events and a^c enables ∃({A, a^c}) operations.

## 4. Dissolving the Reference Problem

### 4.1 The Dissolution Strategy

The PC framework doesn't solve the reference problem but dissolves it by showing it rests on false presuppositions. Reference is not a word-world connection but an internal linguistic operation:

**R(x^c, x^o)** where:

- x^c operates in ∃ realm (conceptual mode)
- x^o operates in E realm (referential mode) 
- x^o ∈ {X, x^o, x^c} (embedded in constellation)
- {X} built through E({X, x^o}) events

When R operates, x^o activates the full {X} constellation including all sensory-motor-emotional patterns learned through experience.

### 4.2 Reference Without Word-World Gaps

Traditional problem: How does "dog" connect to dogs?

PC answer: 

1. {DOG} forms through E({DOG}) events (pre-linguistic)
2. "dog"^o integrates via E({DOG, dog^o}) (Hebbian learning)
3. "dog"^c emerges for ∃({DOG, dog^c}) uses (abstract thought)
4. R(dog^c, dog^o) coordinates between modes
5. dog^o activates full {DOG} constellation

No gap to bridge - just internal coordination grounded in experiential history.

## 5. The x^o/x^c Distinction

### 5.1 Two Modes of Word Function

The PC framework reveals words operate in two distinct modes:

**x^o (object-word mode)**:

- Referential, grounded in E realm
- Tight clustering in embedding space ("rods")
- Built through E({X, x^o}) events
- Activates full {X} constellation

**x^c (concept-word mode)**:

- Abstract, operates in ∃ realm
- Diffuse in embedding space ("caps")
- Enables logical/mathematical operations
- Participates in linguistic pattern constellations ⟪x⟫

### 5.2 Gradient Rather Than Binary

The distinction is gradient. "Cat" has strong x^o grounding through E({CAT, cat^o}) events. "Democracy" operates primarily in x^c mode through ∃({DEMOCRACY, democracy^c}) with minimal E grounding. Most words exhibit both modes to varying degrees.

## 6. Empirical Validation: Language Models

### 6.1 The Rod/Cap Discovery

Analysis of large language model embeddings reveals dual structure:

- **Linguistic rods**: Tight clusters encoding x^o-like referential functions
- **Semantic caps**: Diffuse manifolds encoding x^c-like conceptual operations

This structure emerged without explicit programming, suggesting the x^o/x^c distinction reflects deep computational requirements of language processing.

### 6.2 LLMs as Pure ∃ Systems

LLMs operate entirely in the ∃ realm - they have no E({A}) events, only ∃({A, a^c}) operations. They possess:

- All cap, no rod (in human terms)
- x^c functionality without x^o grounding
- Formal R operations without experiential basis

Yet they achieve reference-like behavior, suggesting reference is fundamentally about pattern coordination rather than consciousness or "grounding" in traditional sense.

### 6.3 Validation of Pattern Coordination

LLMs demonstrate that reference phenomena can emerge from pure pattern coordination without:

- Consciousness or experiential grounding
- Causal connections to external objects
- Internal representations "about" things

This supports the PC view: reference is systematic pattern correspondence, not word-world connection.

## 7. Addressing Field's Challenge Directly

### 7.1 Field's Challenge Reformulated

Field argued Tarski reduces truth to unexplained primitives (reference, satisfaction). In Tarski's T-schema:

```
"Snow is white" is true iff snow is white
```

Field asks: What grounds the right-hand side's reference to snow?

### 7.2 The PC Response

The right-hand side decomposes as:

**Predication level**: R(white^c, snow^o)

- white^c operates conceptually
- snow^o provides referential target

**Reference level**: R(snow^c, snow^o)

- Answers "what does 'snow' refer to?"
- snow^o ∈ {SNOW, snow^o, snow^c}
- {SNOW} includes all sensory patterns from E({SNOW, snow^o}) events

**Complete grounding chain**:

```
E({SNOW}) → E({SNOW, snow^o}) → ∃({SNOW, snow^c}) → R(snow^c, snow^o)
```

No primitive reference - just developmental sequence from experiential to linguistic.

### 7.3 Why Field's Problem Dissolves

Field's challenge assumes reference must be a primitive relation connecting words to world. PC shows:

1. Reference is R(x^c, x^o) - internal linguistic coordination
2. Grounding comes through x^o ∈ {X, x^o, x^c}
3. {X} built through E({X, x^o}) events
4. No mysterious primitive - just Hebbian learning + Hopfield dynamics

The demand for primitive reference is like demanding primitive space-time connections after accepting relativity - it assumes a separation that doesn't exist.

## 8. Some Case Studies

### 8.1 Indexicals & demonstratives (Kaplan: “I”, “here”, “that”)

**Puzzle.** Indexicals and demonstratives shift reference with context: “I” picks out the speaker, “here” the speaker’s location, and a demonstrative combined with pointing picks out the object indicated. Any account of reference must explain this rapid context-dependence and the apparent directness of ostension.

**Standard worry.** Context-sensitivity seems to demand a primitive direct-reference mechanism or a special bridging relation that connects token-use to the immediate context. Purely internalist or purely descriptivist accounts struggle to capture both immediacy and systematicity.

**PC diagnosis.** Demonstratives and indexicals are prototypical cases where `E({A, a^o})` is literally an immediate, multimodal event: a pointing gesture + perceptual contact + deictic embedding. In PC terms:

*   The demonstrative token is an `a^o` deployment tightly coupled to the current E-event (pointing + perception).
*   `R(a^c, a^o)` is highly context-sensitive: the mapping is parameterized by situational cues (speaker identity, spatio-temporal coordinates, gestural vector).
*   Because E-events instantiate the full `{A}` attractor in situ, reference feels direct: the constellation is brought online by the co-occurrence of perceptual, motor, and linguistic cues.

**Upshot.** Indexicality is not a mystical primitive but a case of extreme local weighting in the E/∃ dynamics: certain contextual cues dominate the attractor selection process and constrain the `R` operation to map `a^c` tokens to the locally instantiated `a^o`.

**Empirical signature.** PC predicts systematic variability in demonstrative resolution depending on multimodal cue strength. Experimental manipulations that weaken contextual cues (e.g., occluding gesture, temporal delay) should increase reliance on `a^c`-level inferencing (descriptive resolution) and produce measurable delays or errors in referent selection.

***

### 8.2 Empty names and fiction (Meinong/fictional names)

**Puzzle.** Names that apparently lack real-world referents (“Sherlock Holmes”, “Pegasus”) nonetheless have cognitive and communicative uses: we can ascribe properties, tell stories, and make true/false claims relative to fictional frameworks. How do such names bear meaning without a worldly object?

**Standard worry.** Theories that tie meaning to real-world causal baptism or direct reference struggle: an empty name has no historical referent to hook onto. Descriptivist accounts can accommodate some uses but face circularity and variation in fictional practice.

**PC diagnosis.** Fictional and empty names instantiate `∃`-heavy pattern-constellations: rich `a^c` structure with sparse or counterfactual `a^o` embedding.

*   Authors and audiences build and stabilize `{FICTIONAL}` constellations via repeated imaginative E/∃ activity (narrative immersion, role-play, rehearsal). These constellations have internal coherence (causal/temporal relations, property bundles) even without stable external E-events tied to worldly objects.
*   The `a^o` slot is weakly or hypothetically filled (counterfactual E patterns, imagined percepts) so `R(a^c,a^o)` typically invokes internally generated activations rather than externally triggered ones.
*   This explains how fictional names support internal consistency, counterfactual reasoning, and intra-fiction truth conditions while lacking worldly baptismal grounding.

**Upshot.** Empty names are not meaningless gaps but targets of intense `∃`-practice that instantiate stable conceptual attractors usable in thought and communication. The difference between fictional and real names is a difference in E/∃ weightings, not in kind.

**Empirical signature.** PC predicts that engagement intensity (measured by physiological markers of immersion, frequency of narrative rehearsal, or linguistic co-occurrence statistics) correlates with the coherence and accessibility of fictional constellations. Neurocognitive studies should show overlap between activations for vividly imagined `E` patterns and the a^c activations when users process fictional names.

***

### 8.3 Vagueness and the sorites paradox

**Puzzle.** Predicates like “heap”, “bald”, or “tall” admit borderline cases and admit paradoxical reasoning (sorites). Classical bivalence seems ill-fitted: adding one grain doesn’t change “heap” status, but repeated applications lead to contradiction.

**Standard worry.** Accounts that seek crisp extensions face either arbitrariness (where to draw the line) or paradoxical consequences. Semantic theories propose supervaluation, degrees, or contextualism, but each has costs.

**PC diagnosis.** Vagueness arises naturally from graded attractor landscapes and fuzzy basin boundaries in pattern-constellations:

*   `{HEAP}` is an attractor with a broad, shallow basin; partial cues (number of grains, arrangement) produce graded activation levels rather than binary on/off retrieval.
*   Borderline cases correspond to low-confidence activations where no single basin dominates. `R(a^c,a^o)` returns weak or probabilistic access to the `{HEAP}` constellation.
*   The sorites construction exploits incremental changes that individually produce negligible changes in activation but cumulatively move the system across basins — a natural dynamical phenomenon without paradoxical metaphysical commitments.

**Upshot.** Instead of forcing a sharp line, PC models vagueness as a feature of graded neural/representational dynamics: predicates are implemented by attractors of varying sharpness, and borderlineity is expected where basins overlap or are shallow.

**Empirical signature.** PC predicts that (a) judgments in borderline cases should show higher reaction-time and lower confidence, (b) perceptual/contextual priming can shift activation reliably across the threshold, and (c) training that amplifies certain diagnostic cues (e.g., repeatedly highlighting perceptual differences) will sharpen attractor basins and reduce borderlineity. Psychophysical experiments measuring continuous activation proxies (confidence, reaction times, graded scalar responses) should match the attractor predictions.


## 9. Language as Pattern Coordination System

### 9.1 Not Bridge but Dance

Language doesn't bridge between mind and world. It coordinates E and ∃ realms through the x^o/x^c distinction. Like dancers responding to shared music, speakers coordinate their E({A, a^o}) experiences through ∃({A, a^c}) operations.

### 9.2 Linguistic Pattern Constellations

Beyond primitive PCs, language creates second-order patterns:

**⟪a⟫** - Linguistic Pattern Constellations:

- Patterns of how words behave in ∃ realm
- Enable mathematical/logical thought
- ">" functions as x^o for ⟪comparison⟫
- Grounded ultimately in E events through long chains

### 9.3 Success Without Mystery

Linguistic coordination succeeds through:

1. Shared neural architecture producing similar {A} structures
2. Overlapping E({A, a^o}) experiences during learning
3. ∃({A, a^c}) operations achieving sufficient overlap
4. Continuous mutual adjustment through communication

No mysterious semantic primitives required.

## 10. Philosophical Implications

### 10.1 Truth as Collective Construct

Truth emerges when individual pattern-constellations achieve stable coordination:

```
Individual: E({X, x^o}) builds {X, x^o, x^c}
Collective: ∃({X, x^c}) coordinates between individuals
Truth: Patterns stabilized through collective ∃ operations
```

### 10.2 Sellars Reconciled

Sellars claimed no epistemic content outside conceptual capacities. PC agrees but distinguishes:

**Recognition content**: E({A}) - pre-conceptual pattern-recognition (cats have this)
**Epistemic content**: ∃({A, a^c}) + R(a^c, a^o) - requires linguistic mediation

Both real, neither mysterious.

### 10.3 Normativity Without Correspondence

Correctness emerges from:

- Attractor stability in E realm (Hopfield dynamics)
- Coordination success in ∃ realm (communication)
- No need for correspondence to "objective reality"

## 11. Conclusion

The PC framework dissolves Field's challenge by reconceiving reference entirely. Rather than a primitive relation connecting words to world, reference is R(x^c, x^o) - an internal linguistic operation coordinating between conceptual and referential modes, grounded through pattern-constellations built from experiential events.

This isn't merely a theoretical exercise. The framework:

- Explains the rod/cap structure in language models
- Accounts for referential success without semantic primitives  
- Unifies diverse phenomena under pattern-coordination principles
- Suggests new research directions in linguistics and AI

Like the shift from absolute to relative spacetime, the PC framework doesn't solve old problems but reveals them as artifacts of incorrect assumptions. Reference isn't primitive because it isn't connective - it's the systematic correspondence between experiential and linguistic pattern-recognition events.

## Research Directions

The PC paradigm opens several concrete research paths:

1. **Developmental**: How do {A} → {A, a^o} → {A, a^o, a^c} transitions occur in children?
2. **Computational**: Can we build systems with explicit E/∃ architectures?
3. **Cross-linguistic**: How do different languages create different ⟪a⟫ structures?
4. **Philosophical**: What other "primitive" relations might dissolve under pattern analysis?

[^1]: The most probable learning mechanism for biological neural networks is Hebbian: what fires together, wires together. In an application of Hebbian learning to a specific kind of NN, a Hopfield Network, it is evident that once trained such a network can retrieve the full pattern only from a sequence of it. In the {DUCK} case, either the shape of the head or a “quack” or the funy walk, are all partial patterns of the entire PC {DUCK}, so the presence of one of them will activate the entire PC.

[^2]: There is ample evidence that all infants, when learning words naming objects, tend to grab them, showing how motor areas are integrated with language areas and the need to _sense_ the object more closely and directly. The name is a label for sensory and motor experiences.
[^3]: Experiential actualization E does not need language at all. It is present in animals, but it is also the lived pre-linguistic mystery at the core of modern phenomenology.
[^4]: This is a complicated and lengthy process in humans, which, by all data available, finishes well over the age of 18.
[^5]: By no means is this the only model possible, but it is the most efficient of what we have now. Hopfield networks are few-shots learners and, once trained, are remarkably effective.
[^6]: This may be a subject in itself, but for our purposes it is enough to say that if the sensing pattern and the reaction pattern (which signifies “recognition”) are both parts of a unified PC, then the idea of a pattern without recognition does not make too much sense. One can go through the realism/anti-realism debate rabbit hole, but the approach here is more naturalistic and pragmatic: PCs are not abstract entities but real patterns in neural networks. Funny enough, we cannot make out where the visual pattern is inside a PC because visual neurons never fire in isolation. So, while a PC pattern in a NN is real, its visual component is elusive. Simply said, I cannot find in a NN where the dog image or the dog sound are saved, but I can find easily the entire {DOG} PC.
[^7]: What most famous language puzzles ignore is the _learning_ part. Almost all consider language as a given, abstract collection of tokens governed by abstract rules that we try (and partially succeed) to decode. What PC makes clear is that learning is essential in how language works, and learning is not an exclusively abstract process but is grounded in reality by Pattern Constellations. The way {WATER} is learned on twin Earths is crucial.
