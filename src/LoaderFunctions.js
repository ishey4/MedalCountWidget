function loadjscssfile(filename, filetype, callback) {
  var fileref;
  if (filetype == "js") {
    //if filename is a external JavaScript file
    fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
  } else if (filetype == "css") {
    //if filename is an external CSS file
    fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  };
  if (fileref.readyState) {
    // only required for IE <9
    fileref.onreadystatechange = function () {
      if (fileref.readyState === "loaded" || fileref.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    fileref.onload = function () { callback(); };
  };
  if (typeof fileref != "undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileref)
  };
};

function Init(elementName, options) {
  var parent = document.getElementById(elementName);
  options = options || {};
  options.ReactDOMUrl = options.ReactDOMUrl || 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js';
  options.ReactUrl = options.ReactUrl || 'https://unpkg.com/react@16/umd/react.production.min.js';
  options.parentContainer = options.parentContainer || parent;

  loadjscssfile('widgetStyles.css', 'css', () => { })

  if (typeof React === 'undefined') {
    loadjscssfile(options.ReactUrl, 'js',
    (function ($options) { return function () { Init(elementName, options); }; })(elementName, options));
    return void 0;
    };

  if (typeof ReactDOM === 'undefined') {
    loadjscssfile(options.ReactDOMUrl, 'js',
    (function ($options) { return function () { Init(elementName, options); }; })(elementName, options));
    return void 0;
  };

  initComponent(options);
};

function initComponent(options) {
  if (typeof window.ReactDOM !== 'undefined' && typeof window.React !== 'undefined') {
    let component = React.createElement(MedalCountWidget (React.Component), options);
    ReactDOM.render(component, options.parentContainer);
  };
};
