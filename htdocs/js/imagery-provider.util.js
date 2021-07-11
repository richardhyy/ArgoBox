class ImageryProviderUtil {
    static loadArcGisMapServerImagery(scene, url) {
        let options = {url: url};
        let esri = new Cesium.ArcGisMapServerImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(esri);
    }

    static loadMapboxStyleImagery(scene, styleId, accessToken) {
        let options = {
            styleId: styleId,
            accessToken: accessToken
        };
        let mapbox = new Cesium.MapboxStyleImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(mapbox);
    }


    static loadOpenStreetMapImagery(scene) {
        let options = {
            url: 'https://a.tile.openstreetmap.org/',
            credit: '© OpenStreetMap contributors'
        };
        let osm = new Cesium.OpenStreetMapImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(osm);
    }

    static loadSingleTileImagery(scene, url, rectangle) {
        let options = {
            url: url,
            rectangle: rectangle
        };
        let image = new Cesium.SingleTileImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(image);
    }

    static loadTileMapServiceImagery(scene, url, fileExtension, maximumLevel, rectangle) {
        let options = {
            url : url,
            fileExtension: fileExtension,
            maximumLevel: maximumLevel,
            rectangle: rectangle
        };
        let image = new Cesium.TileMapServiceImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(image);
    }

    static loadUrlTemplateImagery(scene, url, subdomains) {
        let options = {url: url, subdomains: subdomains};
        let urlTemplate = new Cesium.UrlTemplateImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(urlTemplate);
    }

    static loadAmapTile(scene, style = 7) {
        let layer;
        switch (style) {
            case 6:
                layer = "6";
                break;
            case 7:
                layer = "7";
                break;
            case 8:
                layer = "8";
                break;
            default:
                layer = "7";
        }
        let url = 'http://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&scl=1&style=' + layer;
        let subdomains = ['01', '02', '03', '04'];
        this.loadUrlTemplateImagery(scene, url, subdomains)
    }

    static loadWebMapServiceImagery(scene, url, layers) {
        let options = {
            url : url,
            layers : layers,
            proxy: new Cesium.DefaultProxy('/proxy/')
        };
        let wms = new Cesium.WebMapServiceImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(wms);
    }

    static loadWebMapTileServiceImagery(scene, url, layer, style, format, tileMatrixSetID, maximumLevel, credit) {
        let options = {
            url: url,
            layer: layer,
            style: style,
            format: format,
            tileMatrixSetID: tileMatrixSetID,
            maximumLevel: maximumLevel,
            credit: credit
        };
        let wmt = new Cesium.WebMapTileServiceImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(wmt);
    }

    static loadBingMapsImagery(scene, key, mapStyle = Cesium.BingMapsStyle.AERIAL) {
        let options = {
            url : 'https://dev.virtualearth.net',
            key : key,
            mapStyle : mapStyle
        };
        let bing = new Cesium.BingMapsImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(bing);
    }

    static loadGoogleEarthEnterpriseImagery(scene) {
        let geeMetadata = new GoogleEarthEnterpriseMetadata('http://www.earthenterprise.org/3d');
        let gee = new Cesium.GoogleEarthEnterpriseImageryProvider({
            metadata : geeMetadata
        });
        return scene.imageryLayers.addImageryProvider(gee);
    }

    static loadGridImagery(scene) {
        // An ImageryProvider that draws a wireframe grid on every tile with controllable background and glow.
        // May be useful for custom rendering effects or debugging terrain.
        let grid = new Cesium.GridImageryProvider();
        return scene.imageryLayers.addImageryProvider(grid);
    }

    static loadIonImagery(scene, assetId) {
        let options = {
            assetId: assetId
        };
        let ion = new Cesium.IonImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(ion);
    }

    static loadMapboxImagery(scene, mapId, accessToken) {
        let options = {
            mapId: mapId,
            accessToken: accessToken
        };
        let mapbox = new Cesium.MapboxImageryProvider(options);
        return scene.imageryLayers.addImageryProvider(mapbox);
    }

    static loadTileCoordinatesImagery(scene, color = new Cesium.Color(1, 0, 0, 1)) {
        let options = {
            color: color,
        };
        let tc = new Cesium.TileCoordinatesImageryProvider(options);
        let tclayer = scene.imageryLayers.addImageryProvider(tc);
        scene.imageryLayers.raiseToTop(tclayer);
    }
}
