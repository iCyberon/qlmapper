#QLMapper

Create an object or an array of objects from sql output. Used for handling joins and generating grouped objects from columns.

## usage

```
var QLMapper = require('qlmapper');
var row = {"orderId":"300000", "__user__name":"Vahagn","__user__id":200};
var object = QLMapper(row,["user"]);
```

This will generate:
```
{
	"user": {
		"name": "Vahagn",
		"id": 200
	},
	"orderId": "300000"
}
```
