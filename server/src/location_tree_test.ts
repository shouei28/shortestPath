import * as assert from 'assert';
import {
    buildTree, findLocationsInRegion, findClosestInTree, closestInTree, distanceToRegion, NW, NE, SW, SE
  } from './location_tree';


describe('location_tree', function() {

  it('buildTree', function() {
    assert.deepStrictEqual(buildTree([]), {kind: "empty"});

    assert.deepStrictEqual(buildTree([{x: 1, y: 1}]),
        {kind: "single", loc: {x: 1, y: 1}});
    assert.deepStrictEqual(buildTree([{x: 2, y: 2}]),
        {kind: "single", loc: {x: 2, y: 2}});

    assert.deepStrictEqual(buildTree([{x: 1, y: 1}, {x: 3, y: 3}]),
        {kind: "split", at: {x: 2, y: 2},
         nw: {kind: "single", loc: {x: 1, y: 1}},
         ne: {kind: "empty"},
         sw: {kind: "empty"},
         se: {kind: "single", loc: {x: 3, y: 3}}});
    assert.deepStrictEqual(buildTree([{x: 1, y: 3}, {x: 3, y: 1}]),
        {kind: "split", at: {x: 2, y: 2},
         nw: {kind: "empty"},
         ne: {kind: "single", loc: {x: 3, y: 1}},
         sw: {kind: "single", loc: {x: 1, y: 3}},
         se: {kind: "empty"}});

    assert.deepStrictEqual(buildTree(
        [{x: 1, y: 1}, {x: 3, y: 3}, {x: 5, y: 5}, {x: 7, y: 7}]),
        {kind: "split", at: {x: 4, y: 4},
         nw: {kind: "split", at: {x: 2, y: 2},
              nw: {kind: "single", loc: {x: 1, y: 1}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 3, y: 3}}},
         ne: {kind: "empty"},
         sw: {kind: "empty"},
         se: {kind: "split", at: {x: 6, y: 6},
              nw: {kind: "single", loc: {x: 5, y: 5}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 7, y: 7}}}});
    assert.deepStrictEqual(buildTree(
        [{x: 1, y: 1}, {x: 3, y: 3}, {x: 5, y: 3}, {x: 7, y: 1},
         {x: 1, y: 7}, {x: 3, y: 5}, {x: 5, y: 5}, {x: 7, y: 7}]),
        {kind: "split", at: {x: 4, y: 4},
         nw: {kind: "split", at: {x: 2, y: 2},
              nw: {kind: "single", loc: {x: 1, y: 1}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 3, y: 3}}},
         ne: {kind: "split", at: {x: 6, y: 2},
              nw: {kind: "empty"},
              sw: {kind: "single", loc: {x: 5, y: 3}},
              ne: {kind: "single", loc: {x: 7, y: 1}},
              se: {kind: "empty"}},
         sw: {kind: "split", at: {x: 2, y: 6},
              nw: {kind: "empty"},
              ne: {kind: "single", loc: {x: 3, y: 5}},
              sw: {kind: "single", loc: {x: 1, y: 7}},
              se: {kind: "empty"}},
         se: {kind: "split", at: {x: 6, y: 6},
              nw: {kind: "single", loc: {x: 5, y: 5}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 7, y: 7}}}});
  });

  it('findLocationsInRegion', function() {
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([]),
        {x1: 1, x2: 2, y1: 1, y2: 2}),
      []);

    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 0}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      []);
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 2, y: 2}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 2, y: 2}]);

    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 0}, {x: 2, y: 2}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 2, y: 2}]);
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3},
                   {x: 4, y: 4}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]);
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 4}, {x: 1, y: 3}, {x: 2, y: 2}, {x: 3, y: 4},
                   {x: 4, y: 0}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 2, y: 2}, {x: 1, y: 3}]);
  });

  it('closestInTree', function() {
    
    // TODO: implement this in Task 4
    // Statement coverage: first return
    // Branch coverage: enters the branch when distance of the given location to the closest point in the given region is more than the given amount, and the branch when the tree is empty
    // Loop coverage/Recursive: 0 case
    assert.deepStrictEqual(closestInTree(
      buildTree([]),
      {x: 1, y: 1}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, {loc: undefined, dist: 0, calcs: 0}),
      {loc: undefined, dist: 0, calcs: 0});
    // Statement coverage: second return
    // Branch coverage: enters the branch when distance of the given location to the closest point in the given region is more than the given amount, 
    // the branch when the tree is single, and when the location in ClosestInfo is undefined
    // Loop coverage/Recursive: 0 case
    assert.deepStrictEqual(closestInTree(
      buildTree([{x: 2, y: 1}]),
      {x: 1, y: 1}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, {loc: undefined, dist: 0, calcs: 0}),
      {loc: {x: 2, y: 1}, dist: 1, calcs: 1});
    // Statement coverage: third return
    // Branch coverage: enters the branch when distance of the given location to the closest point in the given region is more than the given amount, 
    // the branch when the tree is single, and when the location in ClosestInfo is closer than the location in the tree
    // Loop coverage/Recursive: 0 case
    assert.deepStrictEqual(closestInTree(
      buildTree([{x: 6, y: 3}]),
      {x: 1, y: 1}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, {loc: {x: 4, y: 2}, dist: Math.sqrt(10), calcs: 0}),
      {loc: {x: 4, y: 2}, dist: Math.sqrt(10), calcs: 1});
    // Statement coverage: fourth return
    // Branch coverage: enters the branch when distance of the given location to the closest point in the given region is more than the given amount, 
    // the branch when the tree is single, and when the location in ClosestInfo is farther than the location in the tree
    // Loop coverage/Recursive: 0 case
    assert.deepStrictEqual(closestInTree(
      buildTree([{x: 2, y: 1}]),
      {x: 1, y: 1}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, {loc: {x: 4, y: 2}, dist: Math.sqrt(10), calcs: 0}),
      {loc: {x: 2, y: 1}, dist: 1, calcs: 1});
    // Statement coverage: last return, the return when the location in ClosestInfo is farther than the location in the tree,
    // the return when the location in ClosestInfo is closer than the location in the tree
    // Branch coverage: enters the branch when distance of the given location to the closest point in the given region is more than the given amount, 
    // when distance of the given location to the closest point in the given region is less than the given amount
    // the branch when the tree is single, when the tree is split, when the location in ClosestInfo is farther than the location in the tree, and all of the branches that checks if r is one of the four regions
    // Loop coverage/Recursive: 1 case
    assert.deepStrictEqual(closestInTree(
      {
        kind: "split",
        at: { x: 10, y: 10 }, 
        nw: {
          kind: "single",
          loc: { x: 3, y: 7 }, 
        },
        ne: {
          kind: "single",
          loc: { x: 12, y: 8 },
        },
        sw: {
          kind: "single",
          loc: { x: 6, y: 12 },
        },
        se: {
          kind: "single",
          loc: { x: 15, y: 15 },
        },
      },
      {x: 1, y: 1}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, {loc: {x: 13, y: 15}, dist: Math.sqrt(340), calcs: 0}),
      {loc: {x: 3, y: 7}, dist: Math.sqrt(40), calcs: 1});
    // Statement coverage: last return, the return when the location in ClosestInfo is farther than the location in the tree,
    // the return when the location in ClosestInfo is closer than the location in the tree
    // Branch coverage: enters the branch when distance of the given location to the closest point in the given region is more than the given amount, 
    // when distance of the given location to the closest point in the given region is less than the given amount, entered the branch
    // the branch when the tree is single, when the tree is split, when the location in ClosestInfo is farther than the location in the tree, 
    // when the location in ClosestInfo is closer than the location in the tree, and all of the branches that checks if r is one of the four regions
    // Loop coverage/Recursive: many case
    assert.deepStrictEqual(closestInTree(
      {
        kind: "split",
        at: { x: 12, y: 11 },
        nw: {
          kind: "single",
          loc: { x: 4, y: 13 },
        },
        ne: {
          kind: "split",
          at: { x: 16, y: 5 },
          nw: { kind: "single", loc: { x: 13, y: 8 } },
          ne: { kind: "empty" },
          sw: { kind: "empty" },
          se: { kind: "single", loc: { x: 17, y: 3 } },
        },
        sw: {
          kind: "split",
          at: { x: 5, y: 5 },
          nw: { kind: "single", loc: { x: 3, y: 7 } },
          ne: { kind: "empty" },
          sw: { kind: "empty" },
          se: { kind: "single", loc: { x: 6, y: 3 } },
        },
        se: {
          kind: "single",
          loc: { x: 15, y: 15 },
        },
      },
      {x: 7, y: 6}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, {loc: {x: 13, y: 15}, dist: Math.sqrt(340), calcs: 0}),
      {loc: {x: 6, y: 3}, dist: Math.sqrt(10), calcs: 3});
  });

  it('distanceToRegion', function() {
    // top
    // Statement coverage: second return statement
    // Branch coverage: Enters the if case when the location is right above the region (loc.x >= R.x1 && loc.x <= R.x2) and when it is above the region
    // (loc.y < R.y1) 
    assert.deepStrictEqual(distanceToRegion({ x: 6, y: 2 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 9);
    // bottom
    // Statement coverage: first return statement
    // Branch coverage: Enters the if case when the location is right above the region (loc.x >= R.x1 && loc.x <= R.x2) and when it is below the region
    // if case (loc.y > R.y2)
    assert.deepStrictEqual(distanceToRegion({ x: 6, y: 13 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 9);
    // top left
    // Statement coverage: seventh return statement
    // Branch coverage: Enters the else if case when the location is to the top left of the region (loc.x < R.x1) and if case (loc.y < R.y1)
    assert.deepStrictEqual(distanceToRegion({ x: 1, y: 2 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 25);
    // top right
    // Statement coverage: fifth return statement
    // Branch coverage: Enters the else if case when the location is to the top right of the region (loc.x > R.x2) and if case (loc.y < R.y1)
    assert.deepStrictEqual(distanceToRegion({ x: 14, y: 2 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 25);
    // left
    // Statement coverage: fourth return statement
    // Branch coverage: Enters the else if case when the location is to the left of the region (loc.y >= R.y1 && loc.y <= R.y2) and (loc.x < R.x1)
    assert.deepStrictEqual(distanceToRegion({ x: 1, y: 8 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 16);
    // right
    // Statement coverage: third return statement
    // Branch coverage: Enters the else if case when the location is to the right of the region (loc.y >= R.y1 && loc.y <= R.y2) and if case (loc.x > R.x2)
    assert.deepStrictEqual(distanceToRegion({ x: 14, y: 8 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 16);
    // bottom left
    // Statement coverage: eigth return statement
    // Branch coverage: Enters the else if case when the location is to the bottom left of the region (loc.y > R.y2) and (loc.x < R.x1)
    assert.deepStrictEqual(distanceToRegion({ x: 1, y: 13 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 25);
    // bottom right
    // Statement coverage: sixth return statement
    // Branch coverage: Enters the else if case when the location is to the bottom right of the region (loc.x > R.x2) and (loc.y > R.y2)
    assert.deepStrictEqual(distanceToRegion({ x: 14, y: 13 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 25);
    // in
    // Statement coverage: last return statement
    // Branch coverage: none
    assert.deepStrictEqual(distanceToRegion({ x: 8, y: 8 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 0);
    // on the edge
    // Statement coverage: last return statement
    // Branch coverage: none
    assert.deepStrictEqual(distanceToRegion({ x: 8, y: 5 }, { x1: 5, x2: 10, y1: 5, y2: 10 }), 0);
    // error 
    // Statement coverage: throw error 
    // Branch coverage: if loc or R is undefined
    assert.throws(() => distanceToRegion(undefined, undefined), Error);

  });

  it('NW', function() {
    // Statement coverage: first return 
    assert.deepStrictEqual(NW({x: 2, y: 3}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}), {x1: -Infinity, x2: 2, y1: -Infinity, y2: 3});
    // Statement coverage: first return 
    assert.deepStrictEqual(NW({x: 23, y: 433}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}), {x1: -Infinity, x2: 23, y1: -Infinity, y2: 433});
  });

  it('NE', function() {
    // Statement coverage: first return 
    assert.deepStrictEqual(NE({x: 2, y: 3}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}), {x1: 2, x2: Infinity, y1: -Infinity, y2: 3});
    // Statement coverage: first return 
    assert.deepStrictEqual(NE({x: 23, y: 433}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}),  {x1: 23, x2: Infinity, y1: -Infinity, y2: 433});
  });

  it('SW', function() {
    // Statement coverage: first return 
    assert.deepStrictEqual(SW({x: 2, y: 3}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}), {x1: -Infinity, x2: 2, y1: 3, y2: Infinity});
    // Statement coverage: first return 
    assert.deepStrictEqual(SW({x: 23, y: 433}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}), {x1: -Infinity, x2: 23, y1: 433, y2: Infinity});
  });

  it('SE', function() {
    // Statement coverage: first return 
    assert.deepStrictEqual(SE({x: 2, y: 3}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}), {x1: 2, x2: Infinity, y1: 3, y2: Infinity});
    // Statement coverage: first return 
    assert.deepStrictEqual(SE({x: 23, y: 433}, {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}), {x1: 23, x2: Infinity, y1: 433, y2: Infinity});
  });

  // TODO: uncomment these in Task 4
  it('findClosestInTree', function() {
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 2, y: 1}]),
        [{x: 1, y: 1}]),
      [{x: 2, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 3}]),
        [{x: 1, y: 1}]),
      [{x: 2, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}]),
      [{x: 1, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}, {x: 4.9, y: 4.9}]),
      [{x: 5, y: 5}, Math.sqrt((5-4.9)**2+(5-4.9)**2)]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}, {x: -1, y: -1}]),
      [{x: 1, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 4, y: 1}, {x: -1, y: -1}, {x: 10, y: 10}]),
      [{x: 5, y: 1}, 1]);
  });


});
