/**
 * @param {string} tag
 * @param {object} options 
 */
function $_element(tag, options = {}) {
    const div = document.createElement(tag);
  
    // Set attributes dynamically
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'class') {
        // Handle class as string or array
        div.className = Array.isArray(value) ? value.join(' ') : value;
      } else if (key === 'style') {
        // Handle style as string or object
        if (typeof value === 'string') {
          div.style.cssText = value;
        } else if (typeof value === 'object') {
          Object.assign(div.style, value);
        }
      } else if (key === 'data') {
        // Handle data-* attributes
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          div.setAttribute(`data-${dataKey}`, dataValue);
        });
      } else if (key === 'on') {
        // Handle event listeners
        Object.entries(value).forEach(([event, handler]) => {
          div.addEventListener(event, handler);
        });
      } else if (key === 'text') {
        // Handle text content
        div.textContent = value;
      } else if (key === 'html') {
        // Handle inner HTML
        div.innerHTML = value;
      } else if (key === 'children') {
        // Handle child elements
        value.forEach(child => {
          div.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        });
      } else if (typeof value === 'boolean') {
        // Handle boolean attributes (e.g., disabled, selected)
        if (value) div.setAttribute(key, '');
      } else {
        // Handle other attributes (e.g., for, type, name, etc.)
        div.setAttribute(key, value);
      }
    });
  
    return div;
  }

/**
 * @param {object} options 
 */
function $div(options) {
    return $_element("div", options);
}

function $span(options) {
    return $_element("span", options);
}

function $a(options) {
    return $_element("a", options);
}

function $button(options) {
    return $_element("button", options);
}

function $form(options) {
    return $_element("form", options);
}

function $h1(options) {
    return $_element("h1", options);
}

function $h2(options) {
    return $_element("h2", options);
}

function $h3(options) {
    return $_element("h3", options);
}

function $h4(options) {
    return $_element("h4", options);
}

function $h5(options) {
    return $_element("h5", options);
}

function $h6(options) {
    return $_element("h6", options);
}

function $img(options) {
    return $_element("img", options);
}

function $i(options) {
    return $_element("i", options);
}

function $input(options) {
    return $_element("input", options);
}

function $label(options) {
    return $_element("label", options);
}

function $option(options) {
    return $_element("option", options);
}

function $select(options) {
    return $_element("select", options);
}

function $svg(options) {
    return $_element("svg", options);
}

function $table(options) {
    return $_element("table", options);
}

function $tbody(options) {
    return $_element("tbody", options);
}

function $thead(options) {
    return $_element("thead", options);
}

function $td(options) {
    return $_element("td", options);
}

function $th(options) {
    return $_element("th", options);
}

function $tr(options) {
    return $_element("tr", options);
}

function $ul(options) {
    return $_element("ul", options);
}

function $li(options) {
    return $_element("li", options);
}

function $ol(options) {
    return $_element("ol", options);
}

function appendChildren(node, childrenArray) {
  for (const child of childrenArray) {
    node.appendChild(child);
  }
}

function shuffleArray(arr) {
  const clonedArray = arr.slice();
  
  // Fisher-Yates Shuffle
  for (let i = clonedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));  // Random index
    const temp = clonedArray[i];
    clonedArray[i] = clonedArray[j];
    clonedArray[j] = temp;
  }

  return clonedArray;
}
