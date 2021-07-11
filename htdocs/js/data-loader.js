// MARK: - Data Loading

let taskManager = new TaskManager("loading-modal");

taskManager.newTask(() => loadRemoteGeoJson(
        "api/header/all/latest",
        (source) => colorizeArgoPoints(source, 1),
        () => taskManager.removeTask("load-latest-header")),
    "load-latest-header",
    "Loading latest Argo float locations");

taskManager.commit();


// Mark: - Map Related Functions

function httpGet(url, onSuccess, onError) {
    $.ajax({
        url: url,
        type: 'GET',
        success: data => onSuccess(data),
        error: error => onError(error)
    })
}

function loadRemoteGeoJson(url, painter, onComplete) {
    httpGet(url,
        function (data) {
            console.log(data);
            let promise = Cesium.GeoJsonDataSource.load(JSON.parse(data));
            promise.then(function (dataSource) {
                viewer.dataSources.add(dataSource);
                painter(dataSource);
                onComplete();
            });
        },
        function (error) {
            console.log(error);
        })
}

function colorizeArgoPoints(dataSource, zIndex, color = "#2ca2a7", labeled = false) {
    taskManager.newTask(() =>
        {
            let features = dataSource.entities.values;
            for (let i = 0; i < features.length; i++) {
                let argo = features[i];
                argo.billboard = undefined;
                argo.point = new Cesium.PointGraphics({
                    color: new Cesium.Color.fromCssColorString(color),
                    pixelSize: 14,
                    scaleByDistance: new Cesium.NearFarScalar(0, 1.0, 2.0e7, 0.5),
                    zIndex: zIndex,
                });
                argo.name = argo.id;
                if (labeled) {
                    argo.label = {
                        text : argo.properties['cycle_number'].getValue(),
                        font : '12pt sans-serif',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth : 2,
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset : new Cesium.Cartesian2(0, -9)
                    }
                }
            }
            // make argo features globally available
            document.argoFeatures = features;

            taskManager.removeTask("colorize-argo-points");
        },
        "colorize-argo-points",
        "Colorizing Argo points");
    taskManager.commit();
}

// MARK: - Util

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

function matchFloatList(keyword) {
    if (keyword === "") {
        return [];
    }
    let floats = document.argoFeatures;
    let result = [];
    for (let i=0; i<floats.length; i++) {
        let float = floats[i];
        let platformNumber = float.properties["platform_number"].getValue();
        let projectName = float.properties["project_name"].getValue();
        if (platformNumber !== null) {
            let appearAt = platformNumber.indexOf(keyword.toLowerCase());
            if (appearAt === -1 && projectName !== null) {
                appearAt = projectName.indexOf(keyword)
            }

            if (appearAt !== -1) {
                if (appearAt === 0) {
                    result.insert(0, platformNumber + " - " + projectName);
                } else {
                    result.push(platformNumber + " - " + projectName);
                }
            }
        }

        if (result.length > 9) { // avoid too many results (significantly slowing down the browser)
            break;
        }
    }
    return result;
}
