---
title: Sol geometry and the tangent bundle of a hyperbola
mathjax: On
tags: math
googlepost: 101956452641381748248/posts/ZcKdxXLXX2Q
localscripts: ["/scripts/hammer-2.0.4.min.js", "/scripts/jquery-1.11.3.min.js"]
---

If you try to make rigid motions in some dimension act
as transformations of a lower-dimensional space, you might
hope that it respects some structure in the lower-dimensional space.
Unfortunately this is guaranteed for neither distances nor angles.
Here are some pictures---one of which is interactive (!)---for a
particularly pretty example using Thurston's Sol geometry.
\\(
\\newcommand{\\R}{\\mathbb{R}}
\\newcommand{\\H}{\\mathbb{H}}
\\newcommand{\\SO}{\\operatorname{SO}}
\\newcommand{\\Sol}{\\operatorname{Sol}}
\\)

## Setup

Definition
: \\(\\Sol^3\\) is the Lie group
  \\(\\R^2 \\rtimes \\SO(1,1)^0\\).

Visualize \\(\\Sol^3\\) as a line's worth of copies of \\(\\R^2\\),
where moving up or down in the stack stretches them in one direction and
shrinks them by the same factor in the other.

{::nomarkdown}
<figure>
<canvas id="fig_sol3" width="256" height="256" style="border: 1px solid #000;">
<img src="{{ site.baseurl }}/up/sol3-thumb.png" alt="Sol3 is a stack of planes." />
</canvas>
<figcaption>\(\Sol^3\) is a stack of planes. (Interactive)</figcaption>
</figure>
{:/nomarkdown}

<script type="text/javascript" src="{{ site.baseurl }}/up/sol3.js" data-canvas="#fig_sol3"></script>

We are interested in the action of \\(\\Sol^3\\) on the tangent bundle
\\(T\\H^1\\) of one branch of a hyperbola.

## Description of the action

Let \\(\\mathcal{F}\\) be the 1-D foliation spanned by
\\((\\cosh z, \\sinh z, 0)\\) at \\((x,y,z)\\).
Under the metric \\(dx^2 - dy^2\\) on a plane \\(\\{(\*,\*,z)\\}\\),
the line tangent to \\(x^2 - y^2 = 1\\) at \\((\\cosh z, \\sinh z, 0)\\)
is orthogonal to \\(\\mathcal{F}\\). This identifies \\(\\Sol^3/\\mathcal{F}\\)
with the tangent bundle \\(T\\H^1\\) of one branch of \\(x^2 - y^2 = 1\\).

{% include figure.html alt="A tangent line to a hyperbola" src="h1-tangent.svg" %}

Since \\(\\mathcal{F}\\) is left-invariant (being spanned by a left-invariant
vector field), the left action of \\(\\Sol^3\\) on itself descends to
\\(T\\H^1\\).
Letting \\((p,q)\\) denote a tangent velocity of \\(p\\) at \\(q \\in \\H^1\\),
you can check that this action is given by
\\[
\\begin{align\*}
(0,0,z)(p,q) &= (p,q+z) \\\\ 
(x,y,0)(p,q) &= (p+y \cosh q - x \sinh q, q) .
\\end{align\*}
\\]

{% include figure.html alt="A diffeomorphism and the image of the q-axis" src="sinh-pq.svg" %}

## No preservation of distances or angles

Were we hoping to preserve either in \\(T\\H^1\\),
we'd be out of luck---the stabilizer of \\((0,0)\\) consists of maps
\\[
(p,q) \\overset{(0,x,0)}{\\mapsto} (p - x \\sinh q, q) ,
\\]
whose action on the tangent space \\(T\_{(0,0)}(T\\H^1)\\) is by matrices
\\[ \\begin{pmatrix} 1 & \* \\\\ & 1 \\end{pmatrix}. \\]

## Diffy queues

You can check using the formula that
\\(\\Sol^3\\) acts faithfully on \\(T\\H^1\\).
In fact, here's a nice description of
\\(\\Sol^3\\) as its image in \\(\\operatorname{Diff} T\\H^1\\).

Proposition
: The image of \\(\\Sol^3\\) in \\(\\operatorname{Diff} T\\H^1\\)
consists of the diffeomorphisms \\(f = (f\_p, f\_q)\\) that satisfy
\\[
\\begin{align\*}
\\frac{\\partial f\_p}{\\partial p} &= 1 &
\\frac{\\partial^2 f\_p}{\\partial q^2} &= f\_p \\\\ 
\\frac{\\partial f\_q}{\\partial p} &= 0 &
\\frac{\\partial f\_q}{\\partial q} &= 1 .
\\end{align\*}
\\]

## Recovering the group

To put it another way, the image consists of those diffeomorphisms
expressible as \\(P \\circ Q\_z\\) where

* \\(Q\_z\\) is translation by \\((0,z)\\), and
* \\(P\\) adds to \\(p\\) some linear combination of
  \\(\\cosh q\\) and \\(\\sinh q\\) (or of \\(e^q\\) and \\(e^{-q}\\)).

To see that this is \\(\\Sol^3\\),
parametrize the space \\(V\\) of images of the \\(q\\)-axis as
\\[
V = \\{ \\text{graph of } (q \\mapsto xe^q + ye^{-q}) \\mid x,y \\in \\R \\} .
\\]
Then \\(Q\_z\\), sending \\(q\\) to \\(q+z\\), acts on \\(V\\) by
\\( Q\_z (x,y) = (xe^z, ye^{-z}) \\),
so
\\[\\Sol^3 = V \\rtimes \\{Q\_z \\mid z \\in \\R\\} . \\]

Remark
: This is an [alternative parametrization][MW] of \\(\\Sol^3\\)
under which the action on \\(T\\H^1\\) becomes
\\[ (x,y,z)(p,q) = (p + ye^{q+z} - xe^{-q-z}, q+z) . \\]

[MW]: http://mathworld.wolfram.com/SolGeometry.html

