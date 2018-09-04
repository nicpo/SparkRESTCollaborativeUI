app.filter('notViews', ['Utils', function (Utils) {
    return function (items) {
        if (!items)
            return [];

        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var info = Utils.fromJson(items[i].info);
            if (!info || info.type !== 'view')
                filtered.push(items[i]);
        }

       return filtered;
   };
}]);

app.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});