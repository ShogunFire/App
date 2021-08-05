/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

test('Test bold HTML replacement', () => {
    const boldTestStartString = 'This is a <strong>sentence,</strong> and it has some <strong>punctuation, words, and spaces</strong>. '
        + '<strong>test</strong> * testing* test*test*test. * testing * *testing * '
        + 'This is a <b>sentence,</b> and it has some <b>punctuation, words, and spaces</b>. '
        + '<b>test</b> * testing* test*test*test. * testing * *testing *';
    const boldTestReplacedString = 'This is a *sentence,* and it has some *punctuation, words, and spaces*. '
        + '*test* * testing* test*test*test. * testing * *testing * '
        + 'This is a *sentence,* and it has some *punctuation, words, and spaces*. '
        + '*test* * testing* test*test*test. * testing * *testing *';

    expect(parser.htmlToMarkdown(boldTestStartString)).toBe(boldTestReplacedString);
});

test('Test italic HTML replacement', () => {
    const italicTestStartString = 'This is a <em>sentence,</em> and it has some <em>punctuation, words, and spaces</em>. <em>test</em> _ testing_ test_test_test. _ test _ _test _ '
        + 'This is a <i>sentence,</i> and it has some <i>punctuation, words, and spaces</i>. <i>test</i> _ testing_ test_test_test. _ test _ _test _';
    const italicTestReplacedString = 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _ '
        + 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _';
    expect(parser.htmlToMarkdown(italicTestStartString)).toBe(italicTestReplacedString);
});

// Words wrapped in ~ successfully replaced with <del></del>
test('Test strikethrough HTML replacement', () => {
    const strikethroughTestStartString = 'This is a <del>sentence,</del> and it has some <del>punctuation, words, and spaces</del>. <del>test</del> ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    const strikethroughTestReplacedString = 'This is a ~sentence,~ and it has some ~punctuation, words, and spaces~. ~test~ ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    expect(parser.htmlToMarkdown(strikethroughTestStartString)).toBe(strikethroughTestReplacedString);
});

test('Test Mixed HTML strings', () => {
    const rawHTMLTestStartString = '<em>This is</em> a <strong>test</strong>. None of <h1>these strings</h1> should display <del>as</del> <div>HTML</div>.';
    const rawHTMLTestReplacedString = '_This is_ a *test*. None of these strings should display ~as~ HTML.';
    expect(parser.htmlToMarkdown(rawHTMLTestStartString)).toBe(rawHTMLTestReplacedString);
});

test('Test HTML string with <br/> tags to markdown ', () => {
    const testString = 'Hello<br/>World,<br/>Welcome<br/>To<br/>\nExpensify<br/>\n\nTwo new lines preceded by br';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify\n\nTwo new lines preceded by br';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with inconsistent <br/> closing tags to markdown ', () => {
    const testString = 'Hello<br>World,<br/>Welcome<br>To<br/>Expensify';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with seperate closing tags (<br><br/>) to markdown ', () => {
    const testString = 'Hello<br>World,<br><br/>Welcome<br/>To<br/>Expensify';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with attributes', () => {
    const testString = '<em style="color:red;">This is</em><br style="border-color:red;"> a <button disabled>test</button>. None of <strong data-link=\'bad\'>these strings</strong>.';
    const resultString = '_This is_\n a test. None of *these strings*.';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with spcial Tags', () => {
    const testString = '<html>\n<body>\n<!--StartFragment--><span style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">test message</span><!--EndFragment-->\n</body>\n</html>\n';
    const resultString = 'test message';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});


test('Test HTML string with Internal Tags', () => {
    const testString = `<style>
    span {
        color: rgb(0, 0, 0);
        font-family: "Times New Roman";
        font-size: medium;
        font-style: normal;
        font-variant-ligatures: normal;
        font-variant-caps: normal;
        font-weight: 400;
        letter-spacing: normal;
        orphans: 2;
        text-align: start;
        text-indent: 0px;
        text-transform: none;
        white-space: pre-wrap;
        widows: 2;
        word-spacing: 0px;
        -webkit-text-stroke-width: 0px;
        text-decoration-thickness: initial;
        text-decoration-style: initial;
        text-decoration-color: initial;
        display: inline !important;
        float: none;
    }
</style>
<script type="text/javascript">
    document.write('Hacked');
</script>
<p>test message</p>`;
    const resultString = 'test message';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with encoded entities', () => {
    const testString = 'Text Entity &amp; &quot;';
    const resultString = 'Text Entity & "';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});


test('Test HTML string with blockquote', () => {
    const testString = '<blockquote><p>This GH seems to assume that there will be something in the paste\nbuffer when you copy block-quoted text out of slack. But when I dump\nsome <em>lorem ipsum</em> into a blockquote in Slack, copy it to the\nbuffer, then dump it into terminal, there\'s nothing. And if I dump it </blockquote>'
    + '<blockquote>line1\nline2\n\nsome <em>lorem ipsum</em> into a blockquote in Slack, copy it to the\n\n\nbuffer </blockquote>'
    + '<blockquote style="color:red;" data-label="note">line1 <em>lorem ipsum</em></blockquote>';

    const resultString = '\n> This GH seems to assume that there will be something in the paste\n> buffer when you copy block-quoted text out of slack. But when I dump\n> some _lorem ipsum_ into a blockquote in Slack, copy it to the\n> buffer, then dump it into terminal, there\'s nothing. And if I dump it\n'
    + '\n> line1\n> line2\n> \n> some _lorem ipsum_ into a blockquote in Slack, copy it to the\n> \n> \n> buffer\n'
    + '\n> line1 _lorem ipsum_\n';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with InlineCodeBlock', () => {
    const testString = 'This is a <code>InlineCodeBlock</code> text';

    const resultString = 'This is a `InlineCodeBlock` text';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with code fence', () => {
    const testString = '<pre id="code1">class Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}</pre>';
    const resultString = '```\nclass Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}\n```';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);

    const testStringWithBrTag = '<pre id="code1">class Expensify extends PureComponent {<br />    constructor(props) {<br />        super(props);<br />    }<br />}</pre>';
    const resultStringForBrTag = '```\nclass Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}\n```';
    expect(parser.htmlToMarkdown(testStringWithBrTag)).toBe(resultStringForBrTag);

    const testStringWithNewLinesFromSlack = '<pre class="c-mrkdwn__pre" data-stringify-type="pre" >line1'
    + '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;">'
    + '</span>line3<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>'
    + '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>line6</pre>';
    const resultStringWithNewLinesFromSlack = '```\nline1\n\nline3\n\n\nline6\n```';
    expect(parser.htmlToMarkdown(testStringWithNewLinesFromSlack)).toBe(resultStringWithNewLinesFromSlack);
});