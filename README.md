# Markdown to html parser

This console application parses basic markdown to html 

## Local set up

Installation
```bash
git clone https://github.com/illiakroshka/markdown2html-parser.git
```

Running app
```bash
node src/index.js  <file path>
```
It will parse .md file to escape and log it to terminal


For saving output to the file you can specify file path
```bash
node src/index.js  <file path> --out <file path>
```
It will parse .md file to html format and save it to the file


For specifying format you want to get use --format flag
```bash
node src/index.js  <file path> --out <file path> --format <format>
```


Examples of usage 
```bash
node src/index.js  sample/example.md
```

```bash
node src/index.js  sample/example.md --out sample/index.html
```

```bash
node src/index.js  sample/example.md --out sample/index.txt --format escape
```

# Example

Markdown:
```markdown
Придбав **заєць** собі _форд_фокус_, їде лісом зустрічає `вовка`, `вовк` каже у мене з **лисичкою** побачення можеш довезти до неї, **заєць** каже не питання, **їдуть**, їдуть вовк каже слухай, а що за машина, заєць каже **форд фокус**, хочеш фокус?

**Вовк** каже хочу, заєць каже бачиш _стовп_ щас крізь нього проїдемо **тільки** очі _закрий_, заплющив очі вовк, заєць набрав_швідкість і вправним маневром вліво **об'їхав** стовп,

_Вовк_ очі відкриває, каже: '_нічого_собі_' продай машину будь-які гроші даю, продав `заєць` машину вовку.

**Вовк** покликав **білочок**, **лисичок** їдуть трасою вовк каже у мене машина _форд_фокус_, хочете **фокус**?

Тільки очі треба **закрити** всі погодилися, вовк набирає швидкість їдуть _200км_ на годину і в'їжджають прямо в **стовп** і вовк виходить із машини і кричить: **"яка гнида очі не закрила?"**.

```
Невідомий **автор**
```

```

HTML after parsing: 

```html
<p>Придбав <b>заєць</b> собі <i>форд_фокус</i>, їде лісом зустрічає <tt>вовка</tt>, <tt>вовк</tt> каже у мене з <b>лисичкою</b> побачення можеш довезти до неї, <b>заєць</b> каже не питання, <b>їдуть</b>, їдуть вовк каже слухай, а що за машина, заєць каже <b>форд фокус</b>, хочеш фокус? </p>
<p><b>Вовк</b> каже хочу, заєць каже бачиш <i>стовп</i> щас крізь нього проїдемо <b>тільки</b> очі <i>закрий</i>, заплющив очі вовк, заєць набрав_швідкість і вправним маневром вліво <b>об'їхав</b> стовп, </p>
<p><i>Вовк</i> очі відкриває, каже: '_нічого_собі_' продай машину будь-які гроші даю, продав <tt>заєць</tt> машину вовку. </p>
<p><b>Вовк</b> покликав <b>білочок</b>, <b>лисичок</b> їдуть трасою вовк каже у мене машина <i>форд_фокус</i>, хочете <b>фокус</b>? </p>
<p>Тільки очі треба <b>закрити</b> всі погодилися, вовк набирає швидкість їдуть <i>200км</i> на годину і в'їжджають прямо в <b>стовп</b> і вовк виходить із машини і кричить: <b>"яка гнида очі не закрила?"</b>.</p>
<p>
<pre>
Невідомий **автор**
</pre>
</p>
```

Escape after parsing: 

```escape
[0m
Придбав [1mзаєць[22m собі [3mфорд_фокус[23m, їде лісом зустрічає [7mвовка[27m, [7mвовк[27m каже у мене з [1mлисичкою[22m побачення можеш довезти до неї, [1mзаєць[22m каже не питання, [1mїдуть[22m, їдуть вовк каже слухай, а що за машина, заєць каже [1mфорд фокус[22m, хочеш фокус? [0m
[1mВовк[22m каже хочу, заєць каже бачиш [3mстовп[23m щас крізь нього проїдемо [1mтільки[22m очі [3mзакрий[23m, заплющив очі вовк, заєць набрав_швідкість і вправним маневром вліво [1mоб'їхав[22m стовп, [0m
[3mВовк[23m очі відкриває, каже: '_нічого_собі_' продай машину будь-які гроші даю, продав [7mзаєць[27m машину вовку. [0m
[1mВовк[22m покликав [1mбілочок[22m, [1mлисичок[22m їдуть трасою вовк каже у мене машина [3mфорд_фокус[23m, хочете [1mфокус[22m? [0m
Тільки очі треба [1mзакрити[22m всі погодилися, вовк набирає швидкість їдуть [3m200км[23m на годину і в'їжджають прямо в [1mстовп[22m і вовк виходить із машини і кричить: [1m"яка гнида очі не закрила?"[22m.[0m
[7m
Невідомий **автор**
[27m[0m
```

![image](https://github.com/illiakroshka/markdown2html-escape-parser/assets/116638814/d86f43bb-02d5-4c75-9943-a41246f169ca)

## Tests 
There are 8 unit tests that cheking validation logic, parsing to html and escape

Run tests:

```bash
npm run test
```

## Dropped tests

[Link](https://github.com/illiakroshka/markdown2html-escape-parser/actions/runs/8535784656/job/23382908715?pr=1)

## Revert Commit

[Link](https://github.com/illiakroshka/markdown2html-escape-parser/commit/aa9f7a07e2c527422c9b04ae2ec7e12a6d98be74)

## Conclusion

I had experience of working with different types of tests on [FICE Advisor](https://github.com/fictadvisor/fictadvisor) and sometimes it is boring and lazy to develop it but the help of them is realy significant. It helped me not to break imperceptible at first glance functionality during refactoring tough business logic. 
So my position tests are must for projects that will live in production, it will help to devs and catch bugs on CI stage. 
