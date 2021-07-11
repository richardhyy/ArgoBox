let viewerOptions = {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: true,
    vrButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: true,
    sceneModePicker: true,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: false,
    shouldAnimate: true,
    // terrainProvider: Cesium.createWorldTerrain(
    //     {
    //         requestWaterMask: true,
    //         requestVertexNormals: true
    //     }
    // ),
};

let viewer = new Cesium.Viewer('cesiumContainer', viewerOptions);
let scene = viewer.scene;
let camera = scene.camera;
let canvas = viewer.canvas;
let globe = scene.globe;
viewer.imageryLayers.removeAll();

scene.globe.atmosphereBrightnessShift = 0.1;
viewer.scene.highDynamicRange = false;
// Set ocean color
scene.globe.baseColor = Cesium.Color.fromCssColorString("#96b5c9");

// viewer.animation.container.style.display = "none";

// Load global map
let url = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer';
ImageryProviderUtil.loadArcGisMapServerImagery(scene, url);
