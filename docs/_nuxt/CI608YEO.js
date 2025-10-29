const o={},c={},s={debounceTime(e,t,r){clearTimeout(o[e]),o[e]=setTimeout(()=>{t.apply(this)},r)},reduceExecutions(e,t,r){c[e]||(c[e]=!0,setTimeout(()=>{c[e]=!1},r),t.apply(this))}};export{s as G};
