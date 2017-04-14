---
title: A survey of underlines in HTML
thumbnail: /up/underlines.png
tags: history
googlepost: 101956452641381748248/posts/HtxfD5PzfNd
---

So I was preparing my résumé the other day, because it's job season.
Something sounded elegant about having it in a texty format like LaTeX or HTML.
Since the LaTeX community contains
[a few too many prescriptivists for my taste]({{site.baseurl}}{{page.url}}#prescriptivism),
HTML it was.
Soon, having learned fascinating nuggets like
[how reluctant browsers are to do subpixel drawing][SOSubpixel],
I began to regret not using this as an excuse to learn Scribus.

[SOSubpixel]: http://stackoverflow.com/questions/5709698/
But as much as I would love to tell you about my regrets,
I meant instead to write a post about drawing pretty underlines.
Check out the way Epiphany's underline skips the descender on the "p":

{% include figure.html alt="Chrome 46 (left) vs. Epiphany 3.18 (right)" src="underlines.png" imgextra="itemprop=\"image\"" %}

## Native support in browsers

It turns out that a [text-decoration-skip:ink][W3TextDeco]
has been in a Candidate Recommendation since August 2013.
There's no support yet in ~~[Chrome][ChromeBug] or~~[^ChromeFixed]
[Gecko][GeckoBug];
but in November 2013, only seven months after
[Blink forked from WebKit][BlinkBranchPoint],
support [landed in WebKit][WebKitSkip].
The following January,
[it got made the default][WebKitAlwaysSkip]---in time for the
release of iOS 8 and Safari 8 that fall.

I haven't been able to find the discussion of why
this was the right thing to do.
In fact, Comment 11 in that last link noted that the change deviates from
the specification, provoking [a so-far-unfinished effort][WebKitSkipObjects]
to follow the spec more closely. But given the enthusiasm with which
the change was embraced by observers of iOS 8, it may be here to stay.

[W3TextDeco]: http://www.w3.org/TR/2013/CR-css-text-decor-3-20130801/#text-decoration-skip-property
[ChromeBug]: https://code.google.com/p/chromium/issues/detail?id=477917
[GeckoBug]: https://bugzilla.mozilla.org/show_bug.cgi?id=812990
[BlinkBranchPoint]: https://groups.google.com/a/chromium.org/d/msg/blink-dev/J41PSKuMan0/gD5xcqicqP8J
[WebKitSkip]: https://bugs.webkit.org/show_bug.cgi?id=121806
[WebKitAlwaysSkip]: https://bugs.webkit.org/show_bug.cgi?id=127331
[SkipInk]: https://css-tricks.com/almanac/properties/t/text-decoration-skip/
[Comment11]: https://bugs.webkit.org/show_bug.cgi?id=127331#c11
[WebKitSkipObjects]: https://bugs.webkit.org/show_bug.cgi?id=128723
[^ChromeFixed]: Chrome support was added
    on [November 19, 2016](https://bugs.chromium.org/p/chromium/issues/detail?id=649700).

## Non-native implementations and line thickness

Back in early 2014, descender-skipping was a part of
Marcin Wichary's [tremendous effort on underlines at Medium][Wichary]
that included work to control the thickness of underlines.
(Despite [a noticeable need for thin underlines in light font-weights][Patton],
support for controlling line thickness is nonexistent
[in the spec][W3TextDeco] and [in browsers][ChromeThickness].
And if you searched for such on Google, this may also be an opportunity to
lament how quickly HTML answers become dated
on Stack Overflow---[like this one][SOUnderlineThickness].)

Though the skipping part was dropped from Wichary's final version,
the technique of using a gradient background and `text-shadow`
has inspired a number of other implementations, including at least
two libraries you could use:

1. [Adam Schwartz's SmartUnderline][SmartUnderline]
   covers descender-skipping and line thickness
   with no effort on your part.
2. [Wenting Zhang's Canvas-powered UnderlineJS][Zhang]
   is carefully thought out, down to the sizes of the holes around descenders.
   And the live demo makes sounds!

[Wichary]: https://medium.com/designing-medium/crafting-link-underlines-on-medium-7c03a9274f9
[Patton]: http://www.acusti.ca/blog/2014/11/28/towards-a-more-perfect-link-underline/
[Zhang]: https://github.com/wentin/underlineJS
[SmartUnderline]: https://eager.io/showcase/SmartUnderline/
[ChromeThickness]: https://code.google.com/p/chromium/issues/detail?id=338148
[SOUnderlineThickness]: http://stackoverflow.com/questions/13840403/

## Obstacles to adoption

First, skipping descenders might not actually be the right move;
going against the grain of iOS,
[Ilya Birman argues for thin, uninterrupted link underlines][DontSkip]
on semantic grounds.
A [thread on HN][HNSmartUnderline]
indicates a number of commenters share this viewpoint
(and also points out possible prior art by Roman Komarov).

[DontSkip]: http://ilyabirman.net/meanwhile/all/underlines-and-descenders/
[HNSmartUnderline]: https://news.ycombinator.com/item?id=8587078

Meanwhile, I'm a little bothered by how much closer the "o" is to the
"m" than the "t" in Epiphany's rendering of "motions".
Maybe that's just because I'm used to looking at Chrome;
but until I learn more about kerning,
I guess I'm sticking with using Chrome to render my résumé to PDF.

Still, I'll keep the above in mind in case I ever need to
underline mathematical formulas with subscripts.
Somehow my handwritten notes are full of such,
while the concept has never even occurred to me for typeset math.
(There's a good chance it's a bad idea.)

## A footnote on LaTeX and prescriptivism
{:#prescriptivism}

Okay, it's not really the prescriptivism that I mind
so much as the total lack of interest in justifying prescriptions.
[For example][tablefeet]: despite widespread knowledge that
footnotes in tables are considered bad style,
(1) nobody seems to know why, and
(2) there's a profusion of implementations.
Do these seem causally related to you?

Admittedly, the OP was probably unwise to put two questions in one post,
since accepting an answer for #2 made #1 all but invisible.
And on the bright side, [it could have been less civil][postfixbody].
(Then again, the postfix thread has a happy ending,
which the SE thread can't quite claim.)

[tablefeet]: http://tex.stackexchange.com/questions/1583/
[postfixbody]: http://comments.gmane.org/gmane.mail.postfix.user/196733

## Updates
