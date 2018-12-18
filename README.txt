Medal Count Widget
This Widget has 3 sizes 160px 200px 210px.
The widget will size itself accordingly.
Widget will bootstrap itself if needed. 
There is only 1 parameter needed when initializing.

Example usage
<div id="medal-widget"></div>
<script src="MedalCountWidget.js"></script>
<script type="text/javascript">
   MedalCountWidget.initialize('medal-widget')
</script>


To initialize  the widget use:
MedalCountWidget.Initialize ('id',{options});

e.g. 
<script>
MedalCountWidget.Initialize (
   'medal-widget',
   {
      maxRows:5,
      initialSortField:'total'
   }
);
</script>


id:      the id of the element that will contain the widget *required
options: configuration options see below *optional

options:
initialSortDirection: -1 desc or 1 asc                 Default -1
initialSortField:     'gold','silver','bronze','total' Default 'gold'
maxRows:             (1-14)                           Default 10
ReactDOMUrl:         ReactDOM URL if needed           Default 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js'
ReactUrl:            React URL if needed              Default 'https://unpkg.com/react@16/umd/react.production.min.js'