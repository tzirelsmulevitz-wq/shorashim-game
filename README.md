# Jack's Games

The main page (https://tzirelsmulevitz-wq.github.io/shorashim-game/) is Jack's menu: Shorashim and Times Tables.

## Shorashim

A flash card game for 18 shorashim (Hebrew roots) from Parshas Vayera: flip cards, a 10-question quiz, and a match game.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/shorashim/

## Road to 1776

A 7th grade review game (colonies to the Declaration of Independence): study cards, a quiz, a timeline and a match game, made from the class Review Companion Sheet.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/road-to-1776/

## Times Tables

Multiplication facts 0-10. Write each answer with a finger or stylus (or switch to a number pad), like a timed test. Beat the Clock (60 seconds) or Star Quiz (10 problems), with practice for missed facts.

Play it at https://tzirelsmulevitz-wq.github.io/shorashim-game/math/

### Handwriting

`math/digits-model.json` is a small neural network that reads handwritten digits on the iPad itself (`math/recognizer.js`). It was trained with `tools/train_digits.py` on the MNIST handwritten digit sample included in the `mnist` npm package (MNIST by Yann LeCun, Corinna Cortes and Christopher Burges, CC BY-SA 3.0). It reads about 96% of single digits correctly, so the game shows what it read before the answer is checked.
