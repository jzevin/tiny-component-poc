(function () {
    const core = (function () {
        function buildRegxFromScopeProps(rep) {
            let templ = '{{\\s*?####\\s*?}}'
            let out = ''
            Object.keys(rep).forEach((k, i, a) => {
                out += templ.replace(/####/, k);
                out += i + 1 === a.length ? '' : '|';
            });
            return new RegExp(out, 'g');
        }

        function replace(str, regx, rep) {
            return str.replace(regx, (x) => {
                x = x.replace(/({{\s*)+|(\s*}})/g, '');
                return rep[x];
            });
        }

        function parseAndTag(el, regx) {
            el.dataset.zevIsTagged = true;
            for (let i = 0; i < el.children.length; i++) {
                const child = el.children[i];
                if (!child.children.length && child.innerText.match(regx)) {
                    child.dataset.zevText = child.innerText;
                    child.dataset.zevHasData = true;
                }
                parseAndTag(child);
            }
        }

        function parseCssAndIsolateScope(css, id) {
            return css.replace(/(s*([^{]+)\s*\{\s*([^}]*?)\s*})/ig, (x) => {
                return !x.includes(id) ? `${id} ${x}` : x;
            });
        }

        return {
            buildRegxFromScopeProps, parseAndTag, parseCssAndIsolateScope
        }
    })();

    function ZevComponent(options) {
        this.scope = {
            data: {},
            elements: []
        };
        this.template = options.template;
        this.parent = options.el;
        this.el = document.querySelector(`[${options.selector}]`);
        this.style = core.parseCssAndIsolateScope(options.style, `[${options.selector}]`);
        this.controller = options.controller;
        //
        this.init = () => {
            this.mount();
            setInterval(() => {
                this.render();
            }, 100);
        }

        this.mount = () => {
            this.styleEl = document.createElement('style');
            this.styleEl.innerHTML = this.style;
            this.el.insertAdjacentElement('beforebegin', this.styleEl);
            this.el.innerHTML = this.template;
            this.controller(this.scope, this.el);
        }

        this.render = () => {
            const regx = core.buildRegxFromScopeProps(this.scope.data);
            if (!this.el.dataset.zevIsTagged) {
                core.parseAndTag(this.el, regx);
            }
            this.el.querySelectorAll('[data-zev-has-data=true]').forEach(el => {
                if (el.dataset.zevText) {
                    el.innerText = el.dataset.zevText;
                }
                el.innerText = el.innerText.replace(regx, (x) => {
                    x = x.replace(/({{\s*)+|(\s*}})/g, '');
                    return this.scope.data[x];
                });
            });
        }
        //
        this.init();
    }


    const zc1 = new ZevComponent({
        selector: 'data-test-one',
        template: `
            <h1>JS {{ title   }}</h1>
            <div>{{ content }}</div>
            <button>{{ btnName }}</button>
        `,
        style: `h1 { color: dodgerblue; } [data-test-one] { margin: 1em; padding: 1em; background: #333; color: white; }`,
        controller: (scope, el) => {
            let count = 0;
            scope.data.title = 'Rocks!'
            scope.data.content = 'press it man...';
            scope.data.btnName = 'Do it!';
            el.querySelector('button').addEventListener('click', e => {
                console.log(Math.random());
                scope.data.content = 1000000000 + Math.floor(Math.random() * 1000000000);
                scope.data.btnName = 'Do it! ->' + ++count;
            });
        }
    });

    const zc2 = new ZevComponent({
        selector: 'data-test-two',
        template: `
            <h1>JS {{ title   }}</h1>
            <div>{{ content }}</div>
            <button >{{ btnName }}</button>
            <hr />
            <div>{{ more }}</div>
        `,
        style: `h1 { color: darkorange; } [data-test-two] { margin: 1em; padding: 1em; background: #eee; }`,
        controller: (scope, el) => {
            let count = 0;
            let tmr = 0;
            scope.data.title = 'What?'
            scope.data.content = 'press it man...';
            scope.data.btnName = 'Do it!';
            scope.data.more  = 0;
            el.querySelector('button').addEventListener('click', e => {
                console.log(Math.random());
                scope.data.content = 1000000000 + Math.floor(Math.random() * 1000000000);
                scope.data.btnName = 'Do it! ->' + ++count;
            });
            setInterval(() => {
                scope.data.more = tmr++;
            }, 200);
        }
    });

})();