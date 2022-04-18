# Decision log

## 2022-04-16

- Refactoring and updating to use Express, Pug, and Knex. This way, the project will more closely align with the examples in the book, which will hopefully make the project go faster. I expect the switch will be kind of a pain in the ass, though. In the future, I may migrate to Restify and other JS tools.
- I'm replacing the `createX` methods with classes for a few reasons
  - It gets the project closer to the ideal "functional core, imperative shell" or "clean architecture" patterns.
  - I think classes are more intuitive to read than a bunch of closures and factories.
  - It's something I'm considering for work, and I wanted to try it out.
