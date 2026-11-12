# Yoga page: "Roots of the practice" (unpublished draft)

Taken off `site/yoga.html` on 2 Nov 2026 under the owner's rule: no teacher names and no names except the founders. Nothing was deleted; it is kept here so it can be put back in one step.

## How to restore (two edits to `site/yoga.html`)
1. Put the HTML block under "Section block" back into `site/yoga.html` directly after the section whose `aria-label` is "Steady" and before the `<footer class="site-foot">` line (the place it was before).
2. In the "Family background" aside (`<aside class="family"`), replace the first paragraph with the HTML under "Original family paragraph".
Styles (`ylux-roots`, `ylux-vids`) are still in `site/assets/yoga-lux.css`, so no CSS change is needed.

## Section block (HTML, original, includes the Wikipedia credit and the four video links)
```html
<section class="ylux ylux-roots" aria-labelledby="roots"><div class="ylux-in"><p class="ylux-kick">Roots of the practice</p><h2 id="roots">A Karnataka <em>physical culture</em> lineage</h2><p>In the first half of the twentieth century, Kolar Venkatesh Iyer (K. V. Iyer), born in Kolar district and working in Bangalore, became one of India's best-known advocates of physical culture. He wrote on strength training for ordinary people and tried to bring yoga and Western exercise together in one system. His 1930 book, <em>Muscle Cult</em>, set out that approach. Our own practice follows the same idea: little by little, every day, with respect for the body.</p><p hidden>It also carries a family tradition: the founder's grandfather, Sri V. S. Ramacharya, was an ardent disciple of K. V. Iyer and personally taught the founder physical culture.</p><p class="ylux-src">Summary based on <a href="https://en.wikipedia.org/wiki/K._V._Iyer" rel="noopener">Wikipedia, "K. V. Iyer"</a> (CC BY-SA 4.0). Not to be confused with the film director G. V. Iyer. No photograph is shown until a licensed image is cleared.</p><div class="ylux-vids"><h3>Watch and learn about K. V. Iyer</h3><ul><li><a class="ylux-vid" href="https://youtu.be/PIuL0n1kMiU" target="_blank" rel="noopener">Watch video 1 of 4<span> opens in a new tab</span></a></li><li><a class="ylux-vid" href="https://youtu.be/FuLxLt9VlhI" target="_blank" rel="noopener">Watch video 2 of 4<span> opens in a new tab</span></a></li><li><a class="ylux-vid" href="https://youtu.be/Mdf2Kz0MWZ4" target="_blank" rel="noopener">Watch video 3 of 4<span> opens in a new tab</span></a></li><li><a class="ylux-vid" href="https://youtu.be/bG4vNae-ytU" target="_blank" rel="noopener">Watch video 4 of 4<span> opens in a new tab</span></a></li></ul></div></div></section>
```

## Original family paragraph (HTML)
```html
<p>This practice carries a family tradition. The founder's grandfather, <strong>Sri V. S. Ramacharya</strong>, was an ardent disciple of the physical culture teacher Kolar Venkatesh (K. V.) Iyer, and he personally taught the founder physical culture.</p>
```
