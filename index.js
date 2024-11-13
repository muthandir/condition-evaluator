'use strict';
const get = require('lodash/get');
const isEqual = require('lodash/isEqual');

let conditionals = {
    greaterEq: (condition) => (data) => get(data, condition.key) >= condition.value,
    lowerEq: (condition) => (data) => get(data, condition.key) <= condition.value,
    between: (condition) => (data) => ((x, min, max) => {
        return x >= min && x <= max;
    })(get(data, condition.key), condition.minValue, condition.maxValue),
    equals: (condition) => (data) => get(data, condition.key) === condition.value,
    conditionContains: (condition) => (data) => {
        let conditionData = get(data, condition.key);

        if (Array.isArray(conditionData))
            return conditionData.some((e) => condition.values.includes(e));
        else
            return condition.values.includes(conditionData);
    },
    conditionContainsObject: (condition) => (data) => condition.values.some((e) => Object.keys(e).every((p) => isEqual(e[p], data[p])))
};

module.exports = {
    every: (conditions) => ({
        every: (datas) => conditions.every((condition) => datas.every((data) => conditionals[condition.type](condition)(data))),
        some: (datas) => conditions.every((condition) => datas.some((data) => conditionals[condition.type](condition)(data))),
        single: (data) => conditions.every((condition) => conditionals[condition.type](condition)(data))
    }),
    some: (conditions) => ({
        every: (datas) => conditions.some((condition) => datas.every((data) => conditionals[condition.type](condition)(data))),
        some: (datas) => conditions.some((condition) => datas.some((data) => conditionals[condition.type](condition)(data))),
        single: (data) => conditions.some((condition) => conditionals[condition.type](condition)(data))
    })
};