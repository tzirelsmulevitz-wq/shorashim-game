/* Jack's Chumash test: the parts of the test (from the teacher's review sheet, Parshas Vayera perek 18)
   and how ready Jack is for each part. Shared by chumash/index.html and progress/index.html.

   Every test question the game asks is logged with:
     skill  one of the ids below
     ok     right on the first try
     help   the EN English help was on, or he tapped a word to see what it means
   A question is READY when his latest try WITHOUT help was right on the first try.

   The ids must match chumash/index.html: q + the question's number on the sheet, m- + the malach's
   name, h: / s: / t: + the word, and mimi: / tf: / said: + the position in MIMI / TF / SAID.
   When a new test comes, change the date and the sections here (and bump ready.js?v= in both pages). */
var CHUMASH_TEST = {
  y: 2026, m: 11, d: 25, label: 'Wednesday, November 25',
  sections: [
    { id: 'sheet1', name: 'Questions 1–4', skills: [
      ['q1', 'מִי נִרְאָה אֶל אַבְרָהָם וְלָמָּה?'],
      ['q2', 'לָמָּה יָשַׁב אַבְרָהָם בְּפֶתַח הָאֹהֶל?'],
      ['q3', 'אֵיזוֹ מִצְוָה אָהַב אַבְרָהָם לְקַיֵּם?'],
      ['q4', 'מַדּוּעַ ה׳ שָׁלַח שְׁלֹשָׁה מַלְאָכִים?']] },
    { id: 'mal', name: 'Question 5: each malach’s job', skills: [
      ['m-refael', 'רְפָאֵל'], ['m-gavriel', 'גַּבְרִיאֵל'], ['m-michael', 'מִיכָאֵל']] },
    { id: 'sheet2', name: 'Questions 6–9', skills: [
      ['q6', 'לָמָּה הָאוֹרְחִים הָיוּ צְרִיכִים לִרְחֹץ אֶת הָרַגְלַיִם?'],
      ['q7', 'מִזֶּה לוֹמְדִים לַעֲשׂוֹת מִצְווֹת…'],
      ['q8', 'מָה לוֹמְדִים מִ״פַּת־לֶחֶם״ וּסְעוּדָה גְדוֹלָה?'],
      ['q9', 'אֵיזוֹ בְּשׂוֹרָה טוֹבָה אָמַר הַמַּלְאָךְ?']] },
    { id: 'hipuch', name: 'Vav Hahipuch', he: 'הַהִפּוּךְ', skills: [
      ['h:וַיִּתֵּן', 'וַיִּתֵּן'], ['h:וַיַּרְא', 'וַיַּרְא'], ['h:וַיְמַהֵר', 'וַיְמַהֵר'], ['h:וַיֹּאמְרוּ', 'וַיֹּאמְרוּ'],
      ['h:וַיָּרָץ', 'וַיָּרָץ'], ['h:וַיִּשָּׂא', 'וַיִּשָּׂא'], ['h:וַיֹּאכְלוּ', 'וַיֹּאכְלוּ'], ['h:וַתִּצְחַק', 'וַתִּצְחַק']] },
    { id: 'sofiyot', name: 'Endings', he: 'סוֹפִיּוֹת', skills: [
      ['s:עֵינָיו', 'עֵינָיו'], ['s:עַבְדֶּךָ', 'עַבְדֶּךָ'], ['s:רַגְלֵיכֶם', 'רַגְלֵיכֶם'], ['s:וַאֲדֹנִי', 'וַאֲדֹנִי']] },
    { id: 'mimi', name: 'Who Am I?', he: 'מִי אוֹ מָה אֲנִי', skills: [
      ['mimi:1', 'בָּא לְבַקֵּר אֶת אַבְרָהָם'], ['mimi:2', 'שָׁמְעָה מִפֶּתַח הָאֹהֶל'], ['mimi:3', 'צָחֲקָה בַּלֵּב'],
      ['mimi:4', 'אָמַר שֶׁשָּׂרָה תֵּלֵד בֵּן'], ['mimi:5', 'הִשְׁתַּחֲוָה לַמַּלְאָכִים']] },
    { id: 'tchiliyot', name: 'Prefixes', he: 'תְּחִלִּיּוֹת', skills: [
      ['t:מֵעַל', 'מֵעַל'], ['t:וְאֶקְחָה', 'וְאֶקְחָה'], ['t:הָעֵץ', 'הָעֵץ'], ['t:לַעֲשׂוֹת', 'לַעֲשׂוֹת'], ['t:אָשׁוּב', 'אָשׁוּב'],
      ['t:כְּחֹם', 'כְּחֹם'], ['t:בְּאֵלֹנֵי', 'בְּאֵלֹנֵי'], ['t:תַּעֲשֶׂה', 'תַּעֲשֶׂה'], ['t:וְהוּא', 'וְהוּא']] },
    { id: 'tf', name: 'True or False', he: 'נָכוֹן אוֹ לֹא נָכוֹן', skills: [
      ['tf:1', 'הָיָה יוֹם קַר כְּשֶׁה׳ נִרְאָה אֶל אַבְרָהָם'], ['tf:2', 'הַמַּלְאָכִים הִסְכִּימוּ לֶאֱכֹל בְּאֹהֶל שֶׁל אַבְרָהָם'],
      ['tf:3', 'אַבְרָהָם הָלַךְ לְאַט אֶל הָאֹהֶל שֶׁל שָׂרָה']] },
    { id: 'said', name: 'Who Said It?', he: 'מִי אָמַר אֶל מִי', skills: [
      ['said:1', 'אַל־נָא תַעֲבֹר מֵעַל עַבְדֶּךָ'], ['said:2', 'וְאֶקְחָה פַת־לֶחֶם וְסַעֲדוּ לִבְּכֶם'],
      ['said:3', 'כֵּן תַּעֲשֶׂה כַּאֲשֶׁר דִּבַּרְתָּ'], ['said:4', 'מַהֲרִי שְׁלֹשׁ סְאִים קֶמַח סֹלֶת']] }
  ]
};

/* status of each question: new (never tried), help (tried only with help), missed (latest try without help
   was wrong), ready (latest try without help was right the first time). */
function chumashReadiness(entries) {
  var by = {};
  (entries || []).forEach(function (e) {
    if (!e || e.game !== 'chumash' || !e.skill) return;
    if (e.who && e.who !== 'Jack') return;   /* someone else in the family played */
    var s = by[e.skill] || (by[e.skill] = { tries: 0, t: 0, lastNoHelp: null });
    s.tries++; s.t = Math.max(s.t, e.t || 0);
    if (!e.help) s.lastNoHelp = !!e.ok;
  });
  var total = 0, ready = 0, last = 0;
  var sections = CHUMASH_TEST.sections.map(function (sec) {
    var items = sec.skills.map(function (k) {
      var s = by[k[0]];
      var status = !s ? 'new' : s.lastNoHelp === true ? 'ready' : s.lastNoHelp === false ? 'missed' : 'help';
      return { id: k[0], label: k[1], status: status, tries: s ? s.tries : 0, t: s ? s.t : 0 };
    });
    var count = function (st) { return items.filter(function (i) { return i.status === st; }).length; };
    var r = count('ready'), tried = items.length - count('new');
    var t = items.reduce(function (m, i) { return Math.max(m, i.t); }, 0);
    total += items.length; ready += r; last = Math.max(last, t);
    return { id: sec.id, name: sec.name, he: sec.he || '', items: items, total: items.length, ready: r, tried: tried,
      helpOnly: count('help'), missed: count('missed'), t: t,
      state: r === items.length ? 'ready' : tried ? 'practicing' : 'new' };
  });
  return { sections: sections, total: total, ready: ready, last: last };
}

function chumashDaysLeft() {
  var t = new Date(CHUMASH_TEST.y, CHUMASH_TEST.m - 1, CHUMASH_TEST.d), n = new Date();
  n.setHours(0, 0, 0, 0);
  return Math.round((t - n) / 86400000);
}
