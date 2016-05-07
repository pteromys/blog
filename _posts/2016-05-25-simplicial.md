---
title: Simplicial whatever quickstart guide
mathjax: On
tags: math
---

Simplicial sets are useful for... okay, I really have no idea what.
I just got sucked into reading about them.
But it was a useful exercise to draw the difference between
simplicial complexes, delta complexes, and simplicial sets.
Of many available references,
I enthusiastically recommend [Friedman's notes][Friedman];
the quality of exposition is totally unparalleled.

[Friedman]: http://arxiv.org/abs/0809.4221

## Simplicial complexes

[In video games][MD2], 3-D models are made of triangles
written as lists of vertices.
If you take as a requirement that every simplex
making up a shape can be specified by the set of its vertices
you almost get the definition of a simplicial complex.
(Just add some condition prohibiting self-intersections.)
It's the nicest (most restricted) way to
glue a bunch of simplices together.

[MD2]: https://en.wikipedia.org/wiki/MD2_(file_format)

## Delta complexes

Sometimes you want to do more than play video games.
It being May, maybe you wanted to pick some flowers.

{% include figure.html alt="A flower, not colored in." src="wedge-five-circles.png" %}

The building blocks are a point and some curved line segments---they're still
simplices---but now a line segment's endpoints say nothing about
which line segment we're talking about.

To cope, let's make simplices the primitive objects (rather than vertices).
Then all we specify is which \\(n\\)-simplices are which faces of which
\\((n+1)\\)-simplices. Explicitly, the flower can be specified as:

* a point \\(P\\);
* five line segments \\(a\\), \\(b\\), \\(c\\), \\(d\\), and \\(e\\); and
* the left endpoint of \\(a\\) is \\(P\\) and so is the right endpoint;
* ...and similarly for the other four line segments.

## The reference implementation of a simplex

Category theorists try really hard to express definitions as cute one-liners
involving words like "functor".

## What's still missing

Geometry textbooks are full of wacky instructions like
"glue this face to that face with a 120-degree twist".

## Simplicial sets


