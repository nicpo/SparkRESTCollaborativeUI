app.service('Query', ['$http', 'baseApi', function ($http, baseApi) {
    var query = this;

    query.getFunctions = function () {
        return filterFunctions;
    };

    query.getFeatureFunctions = function () {
        return featureFunctions;
    };

    query.build = function (func, params) {
        if (func.hasPredicate && func.hasLiteral && func.SQL && params.predicate) {
            return func.SQL + '(' + params.columnName + ') ' + params.predicate + ' ' + params.literal;
        } else if (func.hasPredicate && func.hasLiteral && params.predicate) {
            return params.columnName + ' ' + params.predicate + ' ' + params.literal;
        } else if (func.hasPredicate && func.hasLiteral) {
            return func.SQL + '(' + params.columnName + ')';
        } else if (func.SQL === 'LIKE' || func.SQL === 'NOT LIKE') {
            return params.columnName + ' ' + func.SQL + ' "' + params.literal + '"';
        } else if (binaryOperators.indexOf(func.SQL) > -1) {
            return '(' + params.columnName + ' ' + func.SQL + ' ' + params.literal + ')';
        } else if (func.SQL === 'INSTR' || func.SQL === 'NOT INSTR') {
            return func.SQL + '(' + params.columnName + ', "' + params.literal + '")';
        } else if (!func.hasLiteral && !func.hasPredicate) {
            return params.columnName + ' ' + func.SQL;
        } else throw new Error('Unknown function: ' + func.text);
    };

    var commonFunctions = [{
        text: 'Length',
        SQL: 'LENGTH',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Contains (INSTR)',
        SQL: 'INSTR',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: 'Does not contain',
        SQL: 'NOT INSTR',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: 'Like',
        SQL: 'LIKE',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: 'Not Like',
        SQL: 'NOT LIKE',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: 'Abs',
        SQL: 'ABS',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Ln',
        SQL: 'LN',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Log10',
        SQL: 'LOG10',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Log2',
        SQL: 'LOG2',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Sqrt',
        SQL: 'SQRT',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Round',
        SQL: 'ROUND',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Floor',
        SQL: 'FLOOR',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Ceiling',
        SQL: 'CEIL',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Sin',
        SQL: 'SIN',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Asin',
        SQL: 'ASIN',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Cos',
        SQL: 'COS',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Acos',
        SQL: 'ACOS',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Tan',
        SQL: 'TAN',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Atan',
        SQL: 'ATAN',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Degrees',
        SQL: 'DEGREES',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Radians',
        SQL: 'RADIANS',
        hasPredicate: true,
        hasLiteral: true
    }, {
        text: 'Is Null',
        SQL: 'IS NULL',
        hasPredicate: false,
        hasLiteral: false
    }, {
        text: 'Is Not Null',
        SQL: 'IS NOT NULL',
        hasPredicate: false,
        hasLiteral: false
    }];

    var filterFunctions = [{
        text: '[Value]',
        SQL: '',
        hasPredicate: true,
        hasLiteral: true
    }].concat(commonFunctions);

    var featureFunctions = commonFunctions.concat([{
        text: '>',
        SQL: '>',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: '<',
        SQL: '<',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: '=',
        SQL: '=',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: '<=',
        SQL: '<=',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: '>=',
        SQL: '>=',
        hasPredicate: false,
        hasLiteral: true
    }, {
        text: '<>',
        SQL: '<>',
        hasPredicate: false,
        hasLiteral: true
    }]);

    var binaryOperators = ['^', '=', '<', '>', '<=', '>=', '<>'];
}]);