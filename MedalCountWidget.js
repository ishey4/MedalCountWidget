MedalCountWidget= (function(){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MedalCountWidget = function (_Component) {
  _inherits(MedalCountWidget, _Component);

  function MedalCountWidget(props) {
    _classCallCheck(this, MedalCountWidget);

    var _this = _possibleConstructorReturn(this, (MedalCountWidget.__proto__ || Object.getPrototypeOf(MedalCountWidget)).call(this, props));

    _this.state = {
      medals: [],
      maxRows: props.maxRows || 10,
      loadingError: false,
      parentContainer: props.parentContainer,
      parentWidth: props.parentContainer.offsetWidth,
      sort: {
        sortField: props.initialSortField || 'gold',
        sortDirection: props.initialSortDirection && props.initialSortDirection * -1 || 1
      }
    };
    return _this;
  }

  _createClass(MedalCountWidget, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.getMedals();
      var _sortableHeaders = ['rank', 'flag', 'code', 'spacer', 'gold', 'silver', 'bronze', 'total'];
      this.header = _sortableHeaders.map(function (itm) {
        return TableHead(itm, _this2.updateSortOrder.bind(_this2));
      });
    }
  }, {
    key: 'getMedals',
    value: function getMedals() {
      var httpRequest = new XMLHttpRequest();
      var $this = this;
      httpRequest.onreadystatechange = function (data) {
        var _loadingError = false;
        var _medals = [];
        //on error
        if (this.readyState === 4 && this.status !== 200) {
          _loadingError = true;
        };
        //on success
        if (this.readyState === 4 && this.status === 200) {
          var _data = JSON.parse(this.response);
          //sorts the array in alphabetically
          _data.sort($this.sortMedalsBy('code', -1));

          var counter = $this.getCounter();
          _data.forEach(function (e) {
            e.total = e.gold + e.silver + e.bronze; //set totals
            e.key = counter(); //set IDS
          });
          _medals = _data;
        };
        $this.setState({ loadingError: _loadingError, medals: _medals }); //update DOM
      };

      httpRequest.open('GET', 'https://s3-us-west-2.amazonaws.com/reuters.medals-widget/medals.json', true);
      httpRequest.send();
    }
  }, {
    key: 'setWidgetWidth',
    value: function setWidgetWidth(width) {
      var ret = ['width1', 'width2', 'width3'];
      if (width > 160) {
        ret.pop();
      };
      if (width > 200) {
        ret.pop();
      };
      if (width > 210) {
        ret.pop();
      };
      return ret;
    }
  }, {
    key: 'getCounter',
    value: function getCounter() {
      var cnt = -1;return function () {
        cnt = cnt + 1;return cnt;
      };
    }
  }, {
    key: 'sortMedalsBy',
    value: function sortMedalsBy(sortBy, sortDirection) {
      var sd = sortDirection;
      return function (a, b) {
        //first by the header clicked
        if (a[sortBy] > b[sortBy]) {
          return sd * -1;
        };
        if (a[sortBy] < b[sortBy]) {
          return sd * 1;
        };

        //then by gold
        if (a.gold > b.gold) {
          return sd * -1;
        };
        if (a.gold < b.gold) {
          return sd * 1;
        };

        //silver
        if (a.silver > b.silver) {
          return sd * -1;
        };
        if (a.silver < b.silver) {
          return sd * 1;
        };

        //and bronze
        if (a.bronze > b.bronze) {
          return sd * -1;
        };
        if (a.bronze < b.bronze) {
          return sd * 1;
        };

        //leave it alone
        return 0;
      };
    }
  }, {
    key: 'updateSortOrder',
    value: function updateSortOrder(id) {
      var sortDirection = 1;
      if (this.state.sort.sortField === id) {
        sortDirection = this.state.sort.sortDirection * -1;
      };
      this.setState({ sort: { sortField: id, sortDirection: sortDirection } });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var sortFunction = this.sortMedalsBy(this.state.sort.sortField, this.state.sort.sortDirection);
      var widgetClassList = this.setWidgetWidth(this.state.parentWidth);
      widgetClassList.push('MedalCountWidget');
      return React.createElement(
        'div',
        { className: widgetClassList.join(' ') },
        React.createElement(
          'div',
          { className: this.state.loadingError ? '' : 'DisplayNone' },
          React.createElement(ErrorScreen, null)
        ),
        React.createElement(
          'div',
          { className: 'TableDisplay ' + (this.state.loadingError ? 'DisplayNone' : '') },
          React.createElement(
            'div',
            null,
            ' Medal Count '
          ),
          React.createElement(
            'table',
            {
              selectedrow: this.state.sort.sortField,
              sortdirection: this.state.sort.sortDirection.toString() },
            React.createElement(
              'tbody',
              null,
              React.createElement(
                'tr',
                null,
                this.header
              ),
              this.state.medals.sort(sortFunction).slice(0, this.state.maxRows).map(function (e) {
                return medalRow(e);
              })
            )
          )
        )
      );
    }
  }]);

  return MedalCountWidget;
};

//stateless
var TableHead = function TableHead(id, updateSortOrder) {
  return React.createElement(
    'th',
    { key: id, className: id, onClick: function onClick() {
        updateSortOrder(id);
      } },
    React.createElement('div', { className: 'MedalCircle' })
  );
};

//stateless
var ErrorScreen = function ErrorScreen() {
  return React.createElement(
    'div',
    { className: 'ErrorDiv' },
    'Error Loading Widget!'
  );
};

//stateless
var medalRow = function medalRow(medal) {
  var _styles = { 'backgroundPositionY': (medal.key * -17).toString() + 'px' };
  return React.createElement(
    'tr',
    { key: medal.key },
    React.createElement('td', { className: 'Rank' }),
    React.createElement(
      'td',
      null,
      React.createElement('span', { style: _styles, className: 'FlagBackground' })
    ),
    React.createElement(
      'td',
      { className: 'MedalCode' },
      medal.code
    ),
    React.createElement('td', { className: 'Spacer' }),
    React.createElement(
      'td',
      null,
      medal.gold
    ),
    React.createElement(
      'td',
      null,
      medal.silver
    ),
    React.createElement(
      'td',
      null,
      medal.bronze
    ),
    React.createElement(
      'td',
      { className: 'totalColumn' },
      medal.total
    )
  );
};


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
      (function ($options) { return function () { initComponent($options); }; })(options));
  };

  if (typeof ReactDOM === 'undefined') {
    loadjscssfile(options.ReactDOMUrl, 'js', (function ($options) { return function () { initComponent($options); }; })(options));
  };

  initComponent(options);
};

function initComponent(options) {
  if (typeof window.ReactDOM !== 'undefined' && typeof window.React !== 'undefined') {
    let component = React.createElement(MedalCountWidget (React.Component), options);
    ReactDOM.render(component, options.parentContainer);
  };
};


return {initialize:Init}
})();