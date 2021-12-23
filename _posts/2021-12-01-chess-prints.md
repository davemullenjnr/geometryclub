---
layout: post
header: true
title: "Chess Prints"
date: 2021-12-01 09:00:00 +0000
permalink: /blog/chess-prints/
category: blog
hero-image-src: /assets/images/blog/chess-prints/ruy-lopez-chess-opening-poster-print.jpg
hero-image-alt: A framed chess print of the popular opening, Ruy Lopez.

images:
  - src: queens-gambit-chess-opening-poster-print.jpg
  - src: sicilian-defense-chess-opening-print.jpg
  - src: Geometry-Club-Creative-Review-Magazine-image-credits.jpg
  - src: london-system-chess-opening-poster-print.jpg
  - src: caro-kann-defense-chess-opening-poster-print.jpg
  - src: chess-print-fine-art-paper.jpg
---

<section class="container-s mx-auto mt-4 mb-4">
  <p>I absolutely love chess but the <i>'traditional'</i> aesthetic has never been quite to my taste. I’ve been looking for an excuse to make something that’s a bit more elegant and minimal. So, I’ve started making this series of chess prints based on popular openings.</p>
  <p>Here’s a link to my <a class="link-border" href="https://www.etsy.com/shop/DaveMullenJnr">Etsy shop</a> where i've started to list them for sale.</p>
</section>

<section class="container-s mx-auto">
  {% for image in page.images %}
    {% cloudinary /assets/images/blog/chess-prints/{{ image.src }} class="mb-3 mb-md-4 blog-image" alt="Chess prints of popular openings. Perfect chess gift idea as a poster" %}
  {% endfor %}
</section>
