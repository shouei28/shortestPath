import {
  Location, Region, centroid, isInRegion,
  locationsInRegion, overlap, distanceMoreThan, distance
} from "./locations";


export type LocationTree =
  | {readonly kind: "empty"}
  | {readonly kind: "single", readonly loc: Location}
  | {readonly kind: "split", readonly at: Location,
     readonly nw: LocationTree, readonly ne: LocationTree,
     readonly sw: LocationTree, readonly se: LocationTree};


/**
* Returns a tree containing exactly the given locations. Some effort is made to
* try to split the locations evenly so that the resulting tree has low height.
*/
export const buildTree = (locs: Array<Location>): LocationTree => {
  if (locs.length === 0) {
    return {kind: "empty"};
  } else if (locs.length === 1) {
    return {kind: "single", loc: locs[0]};
  } else {
    // We must be careful to include each point in *exactly* one subtree. The
    // regions created below touch on the boundary, so we exlude them from the
    // lower side of each boundary.
    const c: Location = centroid(locs);
    return {kind: "split", at: c,
        nw: buildTree(locationsInRegion(locs,
            {x1: -Infinity, x2: c.x, y1: -Infinity, y2: c.y})
            .filter(loc => loc.x !== c.x && loc.y !== c.y)),  // exclude boundaries
        ne: buildTree(locationsInRegion(locs,
            {x1: c.x, x2: Infinity, y1: -Infinity, y2: c.y})
            .filter(loc => loc.y !== c.y)),  // exclude Y boundary
        sw: buildTree(locationsInRegion(locs,
            {x1: -Infinity, x2: c.x, y1: c.y, y2: Infinity})
            .filter(loc => loc.x !== c.x)),  // exclude X boundary
        se: buildTree(locationsInRegion(locs,
            {x1: c.x, x2: Infinity, y1: c.y, y2: Infinity})),
      };
  }
}


/** Returns all the locations in the given tree that fall within the region. */
export const findLocationsInRegion =
  (tree: LocationTree, region: Region): Array<Location> => {
const locs: Array<Location> = [];
addLocationsInRegion(tree, region,
    {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, locs);
return locs;
};

/**
* Adds all locations in the given tree that fall within the given region
* to the end of the given array.
* @param tree The (subtree) in which to search
* @param region Find locations inside this region
* @param bounds A region that contains all locations in the tree
* @param locs Array in which to add all the locations found
* @modifies locs
* @effects locs = locs_0 ++ all locations in the tree within this region
*/
const addLocationsInRegion =
  (tree: LocationTree, region: Region, bounds: Region, locs: Array<Location>): void => {

if (tree.kind === "empty") {
  // nothing to add

} else if (tree.kind === "single") {
  if (isInRegion(tree.loc, region))
    locs.push(tree.loc);

} else if (!overlap(bounds, region)) {
  // no points are within the region

} else {
  addLocationsInRegion(tree.nw, region,
    {x1: bounds.x1, x2: tree.at.x, y1: bounds.y1, y2: tree.at.y}, locs);
    addLocationsInRegion(tree.ne, region,
    {x1: tree.at.x, x2: bounds.x2, y1: bounds.y1, y2: tree.at.y}, locs);
    addLocationsInRegion(tree.sw, region,
    {x1: bounds.x1, x2: tree.at.x, y1: tree.at.y, y2: bounds.y2}, locs);
    addLocationsInRegion(tree.se, region,
    {x1: tree.at.x, x2: bounds.x2, y1: tree.at.y, y2: bounds.y2}, locs);
}
};


/**
* Returns closest of any locations in the tree to any of the given location.
* @param tree A tree containing locations to compare to
* @param loc The location to which to cmopare them
* @returns the closest point in the tree to that location, paired with its
*     distance to the closest location in locs
*/
export const findClosestInTree =
  (tree: LocationTree, locs: Array<Location>): [Location, number] => {
if (locs.length === 0)
  throw new Error('no locations passed in');
if (tree.kind === "empty")
  throw new Error('no locations in the tree passed in');

let closest = closestInTree(tree, locs[0], EVERYWHERE, NO_INFO);
for (const loc of locs) {
  const cl = closestInTree(tree, loc, EVERYWHERE, NO_INFO);
  if (cl.dist < closest.dist)
    closest = cl;
}
if (closest.loc === undefined)
  throw new Error('impossible: no closest found');
return [closest.loc, closest.dist];
};


/** Bounds that include the entire plane. */
export const EVERYWHERE: Region = {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity};


/**
* A record containing the closest point found in the tree to reference point
* (or undefined if the tree is empty), the distance of that point to the
* reference point (or infinity if the tree is empty), and the number of
* distance calculations made during this process.
*/
type ClosestInfo = {loc: Location | undefined, dist: number, calcs: number};


/** A record that stores no closest point and no calculations performed. */
export const NO_INFO: ClosestInfo = {loc: undefined, dist: Infinity, calcs: 0};


/**
* Like above but also tracks all the information in a ClosestInfo record.
* The closest point returned is now the closer of the point found in the tree
* and the one passed in as an argument and the number of calculations is the
* sum of the number performed and the number passed in.
*/
export const closestInTree =
  (tree: LocationTree, loc: Location, bounds: Region, closest: ClosestInfo): ClosestInfo => {
  // TODO: implement in Task 4
    if(!distanceMoreThan(loc, bounds, closest.dist)){
      if(tree.kind === "empty"){
        return closest;
      } else if(tree.kind === "single"){
        if(closest.loc === undefined || closest.dist === undefined){
          return { loc: tree.loc, dist: distance(tree.loc, loc), calcs: closest.calcs + 1 };
        } else if(closest.dist <= distance(tree.loc, loc)){
          return { loc: closest.loc, dist: closest.dist, calcs: closest.calcs + 1 };
        } else{
          return { loc: tree.loc, dist: distance(tree.loc, loc), calcs: closest.calcs + 1 };
        }
      } else{
        const nw = NW(tree.at, bounds);
        const ne = NE(tree.at, bounds);
        const sw = SW(tree.at, bounds);
        const se = SE(tree.at, bounds);
        const regionArr = [nw, ne, sw, se];
        regionArr.sort((a, b) => distanceToRegion(loc, a) - distanceToRegion(loc, b));
        for(const r of regionArr){
          if(r === nw){
            closest = closestInTree(tree.nw, loc, r, closest);
          } else if(r === ne){
            closest = closestInTree(tree.ne, loc, r, closest);
          } else if(r === sw){
            closest = closestInTree(tree.sw, loc, r, closest);
          } else{
            closest = closestInTree(tree.se, loc, r, closest);
          }
        }
      }
    } 
  // Remove, just here to avoid "declared but never read" errors
  return closest;
}; 

/**
* Helper function that determines the distance between a region and a location
*/
export const distanceToRegion = (loc: Location | undefined, R: Region | undefined): number => {
  if(loc === undefined || R === undefined){
    throw new Error("Not possible");
  }
  if(loc.x >= R.x1 && loc.x <= R.x2){
    if(loc.y > R.y2){
      return (loc.y - R.y2) * (loc.y - R.y2);
    } else if(loc.y < R.y1){
      return (R.y1 - loc.y) * (R.y1 - loc.y);
    }
  } else if(loc.y >= R.y1 && loc.y <= R.y2){
    if(loc.x > R.x2){
      return (loc.x - R.x2) * (loc.x - R.x2);
    } else if(loc.x < R.x1){
      return (R.x1 - loc.x) * (R.x1 - loc.x);
    }
  } else if(loc.x > R.x2){
    if(loc.y < R.y1){
      const width = loc.x - R.x2;
      const length = R.y1 - loc.y;
      return (width * width) + (length * length);
    } else if(loc.y > R.y2){
      const width = loc.x - R.x2;
      const length = loc.y - R.y2;
      return (width * width) + (length * length);
    }
  } else if(loc.x < R.x1){
    if(loc.y < R.y1){
      const width = R.x1 - loc.x;
      const length = R.y1 - loc.y;
      return (width * width) + (length * length);
    } else if(loc.y > R.y2){
      const width = R.x1 - loc.x;
      const length = loc.y - R.y2;
      return (width * width) + (length * length);
    }
  }
  return 0;
}

/**
* Helper function that creates a new region with current 
* region and the location where it will split the region at.
*/
export const NW = (m: Location, R: Region): Region => {
  return {x1: R.x1, x2: m.x, y1: R.y1, y2: m.y};
}

/**
* Helper function that creates a new region with current 
* region and the location where it will split the region at.
*/
export const NE = (m: Location, R: Region): Region => {
  return {x1: m.x, x2: R.x2, y1: R.y1, y2: m.y};
}

/**
* Helper function that creates a new region with current 
* region and the location where it will split the region at.
*/
export const SW = (m: Location, R: Region): Region => {
  return {x1: R.x1, x2: m.x, y1: m.y, y2: R.y2};
}

/**
* Helper function that creates a new region with current 
* region and the location where it will split the region at.
*/
export const SE = (m: Location, R: Region): Region => {
  return {x1: m.x, x2: R.x2, y1: m.y, y2: R.y2};
}