app.service('Utils', [function () {
    this.createTimestamp = function () {
        var curDate = new Date(),
            month = curDate.getMonth() + 1,
            day = curDate.getDate(),
            hour = curDate.getHours(),
            minutes = curDate.getMinutes(),
            seconds = curDate.getSeconds();

        if (month < 10)
            month = '0' + month;
        if (day < 10)
            day = '0' + day;
        if (hour < 10)
            hour = '0' + hour;
        if (minutes < 10)
            minutes = '0' + minutes;
        if (seconds < 10)
            seconds = '0' + seconds;

        return curDate.getFullYear() + month + day + hour + minutes + seconds;
    };

    this.fromJson = function (object) {
        var result = null;
        try {
            result = angular.fromJson(object);
        } catch (e) {
        }

        return result;
    };

    this.validate = new function () {
        var digitTest = /^\d+$/;
        var trainingTest = /^0\.\d{1,4}$/;
        var emailRegEx = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
        var that = this;
        // check if it is int digit which is more than zero
        this.gtZero = function (val) {
            return digitTest.test(val) && parseInt(val) > 0;
        };
        this.fitTrainingSize = function (val) {
            return trainingTest.test(val) && parseFloat(val) > 0;
        };
        this.fitRegParameter = function (val) {
            return that.fitTrainingSize(val);
        };
        this.gtZeroEm = function (val) {
            return that.emptyStr(val) || that.gtZero(val);
        };
        this.emptyStr = function (str) {
            return str === "" || str === null || str === undefined;
        };

        this.fitMiniBatchFraction = function (str) {
            return that.emptyStr(str) || (str === '1' || str === '1.0') || (trainingTest.test(str) && (parseFloat(str) <= 1) && (parseFloat(str) > 0));
        };

        this.fitStepSize = function (str) {
            return that.fitMiniBatchFraction(str);
        };

        this.testEmail = function (str) {
            return emailRegEx.test(str);
        }
    };

    this.misc = new function () {
        var that = this;
        var loadingCounter = function ($scope, loadingState) {
            var counter = 0, that = this;
            var applyState = function () {
                $scope[loadingState] = counter !== 0;
            };

            this.up = function () {
                counter += 1;
                applyState();
            };
            this.down = function () {
                counter -= 1;
                applyState();
            };
        };
        that.buildCounter = function ($scope, loadingState) {
              return new loadingCounter($scope, loadingState);
        };
    };

    this.analysis = new function () {
        var that = this;
        this.headersToCols = function (headers) {
            var columns = [];
            for (var headerIndex in headers) {
                if (headers.hasOwnProperty(headerIndex)) {
                    columns.push({name: headers[headerIndex], checked: false})
                }
            }
            return columns;
        };
        this.checkedCols = function (columns) {
            return columns.filter(function (item) {
                return item.checked;
            });
        };
        this.checkedColsToStr = function (columns) {
            return that.checkedCols(columns).map(function (itemToMap) {
                return itemToMap.name;
            }).join(', ');
        };
        this.headersToStr = function (headers) {
            var columns = [];
            for (var headerIndex in headers) {
                if (headers.hasOwnProperty(headerIndex)) {
                    columns.push(headers[headerIndex]);
                }
            }
            return columns.join();
        }
    };

}]);