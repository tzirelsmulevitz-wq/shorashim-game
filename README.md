# Jack's Games

The main page (https://tzirelsmulevitz-wq.github.io/shorashim-game/) is Jack's menu: Shorashim, Times Tables and Reading.

## Shorashim

A flash card game for 30 shorashim (Hebrew roots) from Parshas Vayera: flip cards, a 10-question quiz, and a match game.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/shorashim/

## Chumash

Review for Parshas Vayera, perek 18, made from the teacher's answer key (דַּפֵּי חֲזָרָה). It goes in three steps, so Jack understands the story before the Hebrew:

1. **The Story**: the whole story of the pesukim (with the Rashis the test uses) in English, in four short chapters with comprehension questions after each one and "Show me in the story". Finishing it once opens steps 2 and 3 on that iPad.
2. **Learn the Words**: flip cards and Word Match for the key Hebrew words, starting with the question words (מִי, לָמָּה, מַדּוּעַ, אֵיזוֹ, מָה).
3. **The Worksheet**: the teacher crosses out the question word and writes the answer back in the question's own words, so these games practice exactly that.

Help everywhere: tap any Hebrew word to see what it means, and the **EN** button (on at first) shows English under the questions, answers, choices and pieces.

- **Answer Key**: each question; tap to cross out the question word and see the answer.
- **Cross It Out**: tap the question word to cross it out, then fill in the blanks of the answer. Question 5 is each malach's job. Score = steps right on the first try.
- **Build the Answer**: tap the pieces of the answer in order (after two misses the right piece glows).
- **Malach Match**: match Refael, Gavriel and Michael to their jobs, then a bonus question.
- **The six words**: study and quiz for the six verb forms (roots and meanings) from the earlier worksheet.

Everything is at the top of the script in `chumash/index.html`: `STORY` (chapters, questions with the right answer first, and `look` sentences copied exactly from the chapter), `VOCAB`, `SHEET` and `MALACHIM` (in each answer, `tiles` must read the same as the answer `a` when joined with spaces), and `GLOSS` / `PHRASES` (the English for every Hebrew word and piece).

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/chumash/

## Reading

Short stories at reading levels O–P with tap-to-answer comprehension questions. After each answer, "Show me in the story" highlights the sentences that prove it. To add a story, add an entry at the top of `STORIES` in `reading/index.html` (the first answer listed is the right one; `look` sentences must be copied exactly from the story; a paragraph starting with `## ` becomes a heading). Then run `node tools/check-reading.js` and fix anything it reports. Stories Jack hasn't opened yet show a NEW badge.

**Choose-your-path adventures** live in the same `STORIES` array with `type: 'adventure'`, a `start` page, and `nodes`: each page has `paras` plus either `choices` (1–3, each `{ text, to }`) or an `ending` (`{ kind: 'super' | 'good' | 'oops', title, tip }`). Most pages also have a `check` quick question (3–4 answers, right one first, `look` copied from that page) that Jack answers before the choices appear. Some choices only work out if he read the clues carefully, and the endings he has found are saved, so he has a reason to read it again. The checker makes sure every choice leads to a real page and every path reaches an ending.

A scheduled task posts a new story on random days (about 2–3 a week), rotating through many kinds: sports, magic tricks, true stories about real people, fun facts, how-tos, science experiments, cards, building, Lego, places near home, Shabbos and the Jewish holidays. Its commits start with `Reading: add`.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/reading/

## Road to 1776

A 7th grade review game (colonies to the Declaration of Independence): study cards, a quiz, a timeline and a match game, made from the class Review Companion Sheet.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/road-to-1776/

## Times Tables

Multiplication facts 0-10. Write each answer with a finger or stylus (or switch to a number pad), like a timed test. Beat the Clock (60 seconds) or Star Quiz (10 problems), with practice for missed facts.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/math/

### Handwriting

`math/digits-model.json` is a small neural network that reads handwritten digits on the iPad itself (`math/recognizer.js`). It was trained with `tools/train_digits.py` on the MNIST handwritten digit sample included in the `mnist` npm package (MNIST by Yann LeCun, Corinna Cortes and Christopher Burges, CC BY-SA 3.0). It reads about 96% of single digits correctly, so the game shows what it read before the answer is checked.

## Auto-update

Safari can keep an old copy of a page for up to 10 minutes after a change. Every page includes the snippet in `tools/auto-update.html` (just before `</body>`): on load it compares the page with the live copy and switches to the new version if they differ, and if an update lands while a page is open it shows a "New update! Tap to get it" button. New pages should include the same snippet.
