function search() {
    let searchWord = $('#search-text').val();
    if (searchWord === "") {
        searchWord = "5906336";
        $('#search-text').val(searchWord);
    }
    let geoserverUrl = `api/header/${searchWord}/all`;

    let taskManager = new TaskManager("loading-modal");
    taskManager.newTask(() => $.ajax({
            url: geoserverUrl,
            type: 'GET',
            success: function (data) {
                // Hide search completion view
                document.getElementById("search-completion").style.display = "none";

                console.log(data);
                let features = JSON.parse(data);
                if (features.totalFeatures >= 1) {
                    // add to layer
                    let promise = Cesium.GeoJsonDataSource.load(features);
                    promise.then(function (dataSource) {
                        viewer.dataSources.add(dataSource);
                        colorizeArgoPoints(dataSource, 1, "#6de398", true);
                    });

                    // locate to target
                    // let lonlat = features.features[0].geometry.coordinates;
                    // console.log(lonlat, lonlat[0], lonlat[1]);
                    // camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], 55000)});

                    let coordinateList = []
                    for (let x of features.features) {
                        coordinateList.push(x.geometry.coordinates[0]);
                        coordinateList.push(x.geometry.coordinates[1]);
                    }

                    viewer.zoomTo(GeometriesHelper.createPolyline(viewer,
                        `Trace ${searchWord}`,
                        Cesium.Cartesian3.fromDegreesArray(coordinateList),
                        8,
                        new Cesium.PolylineGlowMaterialProperty({
                            glowPower: 0.2,
                            taperPower: 0.5,
                            color: Cesium.Color.CORNFLOWERBLUE,
                        })
                    ));
                }

                taskManager.removeTask("search-float");
            },
            error: function (error) {
                taskManager.removeTask("search-float");
                console.log(error);
            }
        }),
        "search-float",
        `Searching for ${searchWord}`
    );
    taskManager.commit();
}

function searchCompletion() {
    let list = matchFloatList($('#search-text').val());
    let target = document.getElementById("search-completion-list");
    if (list.length === 0) {
        document.getElementById("search-completion").style.display = "none";
        return;
    }

    document.getElementById("search-completion").style.display = "block";
    target.innerHTML = "";
    list.forEach(item => {
        let targetText = item.indexOf(" - ")===-1 ? item : item.split(" - ")[0];
        target.innerHTML += `<li onclick="$('#search-text').val('${targetText}')">${item}</li>`;
    })
}

function loadProfile(platformNumber, cycleNumber) {
    httpGet(`api/core/${platformNumber}/${cycleNumber}`,
        (data) => {
            let profile = JSON.parse(data);
            if (profile.features.length === 0) {
                clearProfileList();
            } else {
                showProfileDiagram(profile.features[0].properties["cpressure"],
                    profile.features[0].properties["csalinity"],
                    profile.features[0].properties["ctemperature"]);
            }
        },
        (error) => alert(error));
}

function showProfileDiagram(pressure, salinity, temperature) {
    document.getElementById("profile-container").style.display = "block";

    let profileDom = document.getElementById("diagram-container");
    let profileChart = echarts.init(profileDom, 'dark');

    let colors = ['#6d82c4', '#e88181'];

    let option = {
        color: colors,
        backgroundColor: 'transparent',

        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data:['Salinity (PSU)', 'Temperature (℃)']
        },
        grid: {
            top: 70,
            bottom: 50
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return 'Pressure  ' + params.value + ' (dbar)';
                        }
                    }
                },
                data: pressure
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Salinity (PSU)',
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                label: {
                    formatter: function (params) {
                        return params.value;
                    }
                },
                data: salinity
            },
            {
                name: 'Temperature (℃)',
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                data: temperature
            }
        ]
    };

    option && profileChart.setOption(option);
}

function clearProfileList() {
    document.getElementById("profile-container").style.display = "none";
}

$('#search-text').focus();
$('#search-text').keypress(function (e) {
    const key = e.which;
    if(key === 13)  // the enter key code
    {
        search();
        return false;
    } else { // Match lake
    }
});
$('#search-text').on('input', function () {
    searchCompletion();
});

$('#search-btn').on('click', search);

viewer.selectedEntityChanged.addEventListener(function(selectedEntity) {
    if (Cesium.defined(selectedEntity)) {
        if (Cesium.defined(selectedEntity.name)) {
            console.log('Selected ' + selectedEntity.name);
            if (selectedEntity.properties !== undefined) {
                let platformNumber = selectedEntity.properties["platform_number"];
                let cycleNumber = selectedEntity.properties["cycle_number"];
                loadProfile(platformNumber, cycleNumber);
                return;
            }
        } else {
            console.log('Unknown entity selected.');
        }
    } else {
        console.log('Deselected.');
    }
    clearProfileList();
});