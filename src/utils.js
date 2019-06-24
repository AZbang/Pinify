const split = (arr, count) => 
  arr.reduce((acc, item) => {
    const last = acc[acc.length-1];
    if (last.length < count) acc[acc.length-1].push(item);
    else acc.push([item]);
    return acc;
  }, [[]]);

module.exports = { 
  split,
}