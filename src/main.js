import { createApp } from "vue";
import App from "./App.vue";
import "./css/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


/** 載入共享的Styles */
export const loadShareStyles = (shadowRoot, styles) => {
  
  if (styles.length === 0) {
      resolve("no share style");
  }

  return new Promise((resolve, reject) => {
      if (!styles || styles.length === 0) {
          resolve("no share style");
      }
      let completed = 0;
      styles.forEach(uri => {
          const linkElem = document.createElement('link');
          linkElem.setAttribute('rel', 'stylesheet');
          linkElem.setAttribute('href', uri);
          linkElem.onload = () => {
              completed++;
              if (styles.length === completed) {
                  resolve("load share styles completed");
              }
          }
          shadowRoot.appendChild(linkElem);
          console.log(shadowRoot);
      });
  });
}

/** inlinestyle要複製過來 */
const copyInlineStyle = (ins) => {
  const inlineStyles = document.querySelectorAll('head style');
  if (inlineStyles.length >0 ) {
    ins.shadowRoot.appendChild(inlineStyles[0]);
  }
} 

/** 從兩個地方過來，但只有最後一次會啟動 */
const loadApp = (ins) => {
  if (ins.loadstyle && ins.connected) {
    if (process.env.NODE_ENV === "development") {
      copyInlineStyle(ins);
    }
    ins.shadowRoot.appendChild(ins.wrapper.children[0]);
  }
}

/** 建立HTML Custom Element */
class CustomElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const that = this;
    loadShareStyles(this.shadowRoot, ['main.css']).then(() => {
      this.loadstyle=true;
      loadApp(this);

    });
  }

  connectedCallback() {
    const options = typeof App === "function" ? App.options : App;
    const propsList = Array.isArray(options.props) ? options.props : Object.keys(options.props || {});

    const props = {};
    for (const prop of propsList) {
      const propValue = process.env.NODE_ENV === "development" ? process.env[`VUE_APP_${prop.toUpperCase()}`] : this.attributes.getNamedItem(prop)?.value;

      if (!propValue) {
        console.error(`Missing attribute ${prop}`);
        return;
      }

      props[prop] = propValue;
    }

    const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

    this.wrapper = document.createElement("div");
    app.mount(this.wrapper);
    this.connected = true;
    loadApp(this);
  }
}
  
window.customElements.define("native-service", CustomElement);