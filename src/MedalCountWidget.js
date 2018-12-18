class MedalCountWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medals: [],
      maxRows: props.maxRows || 10,
      loadingError: false,
      parentContainer: props.parentContainer,
      parentWidth: props.parentContainer.offsetWidth,
      sort: {
        sortField: props.initialSortField || 'gold',
        sortDirection: (props.initialSortDirection && props.initialSortDirection * -1) || 1
      }
    };
  };

  componentDidMount() {
    this.getMedals();
    let _sortableHeaders = ['rank', 'flag', 'code', 'spacer', 'gold', 'silver', 'bronze', 'total'];
    this.header = _sortableHeaders.map((itm) => { return TableHead(itm, this.updateSortOrder.bind(this)) });
  };

  getMedals() {
    var httpRequest = new XMLHttpRequest();
    let $this = this;
    httpRequest.onreadystatechange = function (data) {
      let _loadingError = false;
      let _medals = [];
      //on error
      if (this.readyState === 4 && this.status !== 200) {
        _loadingError = true;
      };
      //on success
      if (this.readyState === 4 && this.status === 200) {
        let data = JSON.parse(this.response);
        //sorts the array in alphabetically
        data.sort($this.sortMedalsBy('code', -1));



        let counter = $this.getCounter();
        data.forEach(e => {
          e.total = e.gold + e.silver + e.bronze;//set totals
          e.key = counter();                     //set IDS
          e.medalRow = medalRow(e);              //generate medal rows
        });
        _medals = data;
      };
      $this.setState({ loadingError: _loadingError, medals: _medals }); //update DOM
    };

    httpRequest.open('GET', 'https://s3-us-west-2.amazonaws.com/reuters.medals-widget/medals.json', true);
    httpRequest.send();
  };

  setWidgetWidth(width) {
    let ret = ['width1', 'width2', 'width3'];
    if (width > 160) { ret.pop() };
    if (width > 200) { ret.pop() };
    if (width > 210) { ret.pop() };
    return ret;
  };

  getCounter() { let cnt = -1; return () => { cnt = cnt + 1; return cnt; }; };

  sortMedalsBy(sortBy, sortDirection) {
    let sd = sortDirection;
    return (a, b) => {
      //first by the header clicked
      if (a[sortBy] > b[sortBy]) { return sd * -1 };
      if (a[sortBy] < b[sortBy]) { return sd * 1 };

      //then by gold
      if (a.gold > b.gold) { return sd * -1 };
      if (a.gold < b.gold) { return sd * 1 };

      //silver
      if (a.silver > b.silver) { return sd * -1 };
      if (a.silver < b.silver) { return sd * 1 };

      //and bronze
      if (a.bronze > b.bronze) { return sd * -1 };
      if (a.bronze < b.bronze) { return sd * 1 };

      //leave it alone
      return 0;
    };
  };

  updateSortOrder(id) {
    let sortDirection = 1;
    if (this.state.sort.sortField === id) { sortDirection = this.state.sort.sortDirection * -1 };
    this.setState({ sort: { sortField: id, sortDirection: sortDirection } });
  };

  render() {
    let sortFunction = this.sortMedalsBy(this.state.sort.sortField, this.state.sort.sortDirection);
    let widgetClassList = this.setWidgetWidth(this.state.parentWidth);
    widgetClassList.push('MedalCountWidget');
    return (
      <div className={widgetClassList.join(' ')}>
        <div className={this.state.loadingError ? '' : 'DisplayNone'}>
          <ErrorScreen />
        </div>
        <div className={'TableDisplay ' + (this.state.loadingError ? 'DisplayNone' : '')}>
          <div> Medal Count </div>
          <table
            selectedrow={this.state.sort.sortField}
            sortdirection={this.state.sort.sortDirection.toString()}>
            <tbody>
              <tr>
                {this.header}
              </tr>
              {this.state.medals
                .sort(sortFunction)
                .slice(0, this.state.maxRows)
                .map(e => { medalRow(e) })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
};

//stateless
const TableHead = (id, updateSortOrder) => {
  return (
    <th key={id} className={id} onClick={() => { updateSortOrder(id) }} >
      <div className="MedalCircle"></div>
    </th>
  )
};

//stateless
const ErrorScreen = () => {
  return (
    <div className={'ErrorDiv'}>
      Error Loading Widget!
    </div>
  )
};

//stateless
const medalRow = (medal) => {
  let _styles = { 'backgroundPositionY': (medal.key * -17).toString() + 'px' }
  return (
    <tr key={medal.key}>
      <td className="Rank"></td>
      <td ><span style={_styles} className={'FlagBackground'}></span></td>
      <td className={'MedalCode'}>{medal.code}</td>
      <td className={'Spacer'}></td>
      <td>{medal.gold}</td>
      <td>{medal.silver}</td>
      <td>{medal.bronze}</td>
      <td className='totalColumn'>{medal.total}</td>
    </tr>
  )
};