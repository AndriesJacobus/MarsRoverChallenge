//= require react-server
//= require react_ujs
//= require ./components
//
// By default, this file is loaded for server-side rendering.
// It should require your components and any dependencies.// By default, this pack is loaded for server-side rendering.
// It must expose react_ujs as `ReactRailsUJS` and prepare a require context.
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);
