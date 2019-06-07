# tiny component poc

Wanted to try a basic component constructor function in ***Vanilla JavaScript*** that mimics the old AngularJS constructor to a degree.

Also did not look at anything else and the code is 100% mine except the CSS regular expression.

### Check out the [demo](https://phillydesignr.github.io/tiny-component-poc/)

> **Note:** of course there are inefficiencies and things that could be improved... it's just a poc done in a couple hours.

- each component has a semi-isolated scope with own controller
- isolated styles by appending component selector to the component style

Things I want to explore or improve
- ShadowDom
- Scope change detection
- Improved template binding
- Global render function
- Better scope isolation