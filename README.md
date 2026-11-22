# Jack's Games

The main page (https://tzirelsmulevitz-wq.github.io/shorashim-game/) is Jack's menu: Shorashim, Times Tables and Reading.

## Shorashim

A flash card game for 30 shorashim (Hebrew roots) from Parshas Vayera: flip cards, a 10-question quiz, and a match game.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/shorashim/

## Chumash

Review for Parshas Vayera, perek 18, made from both sides of the teacher's answer key (דַּפֵּי חֲזָרָה), questions 1-9, for the Chumash test on November 25. It goes in three steps, so Jack understands the story before the Hebrew:

1. **The Story**: the whole story of the pesukim (with the Rashis the test uses) in English, in four short chapters with comprehension questions after each one and "Show me in the story". Finishing it once opens steps 2 and 3 on that iPad.
2. **Learn the Words**: flip cards and Word Match for the key Hebrew words, starting with the question words (מִי, לָמָּה, מַדּוּעַ, אֵיזוֹ, מָה).
3. **The Worksheet**: the teacher crosses out the question word and writes the answer back in the question's own words, so these games practice exactly that.
4. **More from the Review Sheet** (pages 3-4 of the blank review sheet on Google Classroom): Vav Hahipuch (root and meaning), Prefixes and Endings (what the added letters mean, then the whole word), Who Am I?, Who Said It? and True or False. Data is in `HIPUCH`, `TCHILIYOT`, `SOFIYOT`, `MIMI`, `SAID` and `TF`; roots are written without final letters, like the class does.

**Ready for the test?** (on the Chumash page once the story is done) lists the 9 parts of the test with how many of their 44 questions are ready. Every test question Jack answers is logged with `skill` (its id in `chumash/ready.js`), `ok` (right on the first try) and `help` (English help was on, or he tapped a word for its meaning). A question is ready when his latest try *without* help was right the first time. From the card:
- **Today's practice**: 10 questions, the ones not tried or missed first, at most two from each part.
- **Practice test**: 16 questions from every part, one try each, English help switched off, with a score for each part.

The Progress page shows the same readiness for parents: each part, when it was last practiced, which questions are not ready yet (missed, only with English help, not tried) and the practice tests. On a parent's phone, paste the access token once and the page loads the results the iPad last sent. `chumash/ready.js` holds the test date and the list of test questions for both pages.

A countdown to the test shows on the Chumash page and on its tile in the menu, and hides itself after the test day. For the next test, change `TEST` near the top of the script in `chumash/index.html` and the date in the countdown script in `index.html`.

Help everywhere: tap any Hebrew word to see what it means, and the **EN** button (on at first) shows English under the questions, answers, choices and pieces.

- **Answer Key**: each question; tap to cross out the question word and see the answer.
- **Cross It Out**: tap the question word to cross it out, then fill in the blanks of the answer. Question 5 is each malach's job. Score = steps right on the first try.
- **Build the Answer**: tap the pieces of the answer in order (after two misses the right piece glows).
- **Malach Match**: match Refael, Gavriel and Michael to their jobs, then a bonus question.
- **The six words**: study and quiz for the six verb forms (roots and meanings) from the earlier worksheet.

Everything is at the top of the script in `chumash/index.html`: `STORY` (chapters, questions with the right answer first, and `look` sentences copied exactly from the chapter), `VOCAB`, `SHEET` (each question has its number on the sheet as `n`; `stmt: true` marks a fill-in sentence with no question mark), `SEQ` (the order on the sheet, with question 5 as `'M'`) and `MALACHIM` (in each answer, `tiles` must read the same as the answer `a` when joined with spaces), and `GLOSS` / `PHRASES` (the English for every Hebrew word and piece).

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
