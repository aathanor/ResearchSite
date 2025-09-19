---
title: "Methodological precautions: serial vs parallel"
author: Florin Cojocariu
categories: "core-theory" 
tags: ["methodological-precautions"]
lens: ["philosophy", "cognition"]
node: "methodology"
status: "first draft"
date: 09.17.2025
tags: main_research, support_draft
---

# Methodological Precautions: serial vs parallel processes

The phenomenological analysis of Pattern Constellations finds striking support in neuroscience, but it's crucial to clarify the methodological approach. Rather than deriving PRI from empirical findings, our approach starts with **conceptual analysis** of what recognition actually _is_ and its parallel nature, then finds neuroscience evidence that supports this analysis. This sidesteps the usual objection, "But you're just describing very fast sequential processing" by arguing that sequential processing is the wrong conceptual model entirely.

## The Model Tyrany

In general terms, any empirical methodological approach is fundamentally analytical and is built on the model used to analyze the target phenomena. So that if the model of the mind is computational (serial), the methodology will rely on the assumption that the mind processes are serial. That makes it almost impossible to construct a new model, as all empirical data will be fitted within the existing model. This happens in all sciences, up to the point when the empirical evidence that refuses to fit the model accumulates and points to contradictions in the model. (a good example is the transition from the mechanic to the quantum model).

There are plenty of contradictions in the existing serial model of cognition, but in this particular case the problem is compounded by the fact that reasoning and language used to describe processes is _by definition_ serial. In fact we cannot describe anything other than using a _series_ of words; we cannot receive any information other than by reading or listening to a _series_ of words. Reasoning itself is _by definition_ serial, being a concatenation of proof steps. How, then, to describe a parallel process?[^5]

## Simultaneity and Succession

There is an interesting analogy in the transition from classical to quantum mechanics: the way we perceive the world makes the quantum model counterintuitive, if not  irrational altogether. That created huge problems in the acceptance of the new model, problems not solved even today, more than a century later.

A similar difficulty appears here: the way we describe and think about the world makes parallel processing an almost impossible process to imagine fully. Entrenched as we are in serial reasoning and uttering, we’ll argue that there is always a succession in time, no matter how small the differences between steps. I expect this to be one of the main objections to the Pattern Constellations idea: “There is no simultaneity but very fast serial processing.”

I argue, though, that it is not simultaneity that separates parallel from serial but something else: in a serial process, every step processes only output from the previous step. While the previous step did not generate an output, the next one will not activate. In a parallel process, a single input will activate different streams of processing that will, later on be joined in some way into some sort of output.

## Artificial Neural Networks to the Rescue

Math can come to the rescue here, as it did in QM where Hillbert’s formalism allowed for a new ‘language’ to describe what common sense couldn’t. But to get to the math, we need to go through modern NN.

The success of modern LLMs is largely based on the unexpected power of transformers architecture. As described in detail elsewhere in this work, when a LLM gets a long prompt, say a 300-word one, it does something that can be best described as ”attending to all the words at once'”. It will not process the text as we do, by first scanning it word by word, but instead looking at it as some sort of geometrical object in a highly dimensional space that “fits” in a certain area of this space, with different sub-space manifolds overlapping too to other manifolds. Simply said, it recognizes its position in a very complicated high dimensional space almost instantly[^6]. The way to explain this is that all the words in a prompt are processed in parallel. We should note that the real output of this parallel processing is not a text (the answer you receive) but a certain defined area of possible answers in the abstract embedding space.[^7]

There are other NN architectures that bring parallelism closer to our understanding. One of them is the Hopfield Network which uses Hebbian learning to remember patterns is exposed to. In this case, the result of repeated exposure to a pattern is not some sort of generated response but a reorganization of the NN itself into a sparse, weighted one. Once trained, when such a network is exposed to a learned pattern, will almost at once activate a group of neurons that activate altogether _only_ when exposed to that pattern. There is no analysis of the pattern involved, the reaction (which is recognition) is encoded into the N  N structure and happens instantly.

For this reason Hopfield Networks with Hebbian Learning are closer to biological NN and the best theoretical model for our Pattern Constellations theory. The best part is that they are very well founded theoretically on a rigurous energy model that we will adapt to our purposes here.

[^5]: “Process” itself supposes steps and seriality. However, it must be said that modern phenomenology came closer to what will be a philosophical description of the parallel nature of the mind and living. Sadly though, phenomenology is perceived as an exotic linguistic exercise in the analytical world.

[^6]: There are lots of serial processes before and after in a modern LLM but the way transformers work is parallel.
[^7]: Transformers use heavy serial processes in training, because of layuers and back-propagation, but this is a separate subject, treated elsewhere.
