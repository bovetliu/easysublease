// JavaScript Document
/*
* This is the utilities page of easysublease.org, This page defines the namespaces, I can see the hierachy clearly.
* Also some inportant variables are also defined here, such as 
*
*/
// create the root namespace and making sure we're not overwriting it
var EasySubOrg = EasySubOrg || {};  // initialize EasySubOrg parent namespace. this is one global namespace
// create a general purpose namespace method
// this will allow us to create namespace a bit easier
EasySubOrg.createNS = function (namespace) {  // namespace is string
    var nsparts = namespace.split(".");
    var parent = EasySubOrg;
    // we want to be able to include or exclude the root namespace 
    // So we strip it if it's in the namespace
    if (nsparts[0] === "EasySubOrg") {
        nsparts = nsparts.slice(1);
    }
    // loop through the parts and create 
    // a nested namespace if necessary
    for (var i = 0; i < nsparts.length; i++) {
        var partname = nsparts[i];
        // check if the current parent already has 
        // the namespace declared, if not create it
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }
        // get a reference to the deepest element 
        // in the hierarchy so far
        parent = parent[partname];
    }
    // the parent is now completely constructed 
    // with empty namespaces and can be used.
    return parent;
};