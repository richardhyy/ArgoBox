class GeometriesHelper {
    static createPoint(viewer, name, description, position, pixelSize = 30, scaleByDistance = undefined, translucencyByDistance = undefined, distanceDisplayCondition = undefined, heightReference = Cesium.HeightReference.NONE, color = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        let options = {
            name: name,
            description: description,
            position: position,
            point: {
                pixelSize: pixelSize,
                heightReference: heightReference,
                color: color,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
                scaleByDistance: scaleByDistance,
                translucencyByDistance: translucencyByDistance,
                distanceDisplayCondition: distanceDisplayCondition,
            }
        }
        return viewer.entities.add(options);
    }

    static createBox(viewer, name, position, dimensions, fill = true, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            position: position,
            box: {
                dimensions: dimensions,
                fill: fill,
                material: material,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
            },
        });
    }

    static createCircle(viewer, name, position, radius, extrudedHeight = 0, material = Cesium.Color.FUCHSIA, withOutline = false) {
        this.createEllipse(viewer, name, position, radius, radius, extrudedHeight, 0, material, withOutline);
    }

    static createEllipse(viewer, name, position, semiMinorAxis, semiMajorAxis, extrudedHeight = 0, rotationAngle = 0, material = Cesium.Color.FUCHSIA, withOutline = false) {
        return viewer.entities.add({
            name: name,
            position: position,
            ellipse: {
                semiMinorAxis: semiMinorAxis,
                semiMajorAxis: semiMajorAxis,
                extrudedHeight: extrudedHeight,
                rotation: Cesium.Math.toRadians(rotationAngle),
                material: material,
                outline: withOutline,
            },
        });
    }

    static createSphere(viewer, name, position, radius, innerRadius, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1, minimumClockAngle = 0, maximumClockAngle = 360, minimumConeAngle = 0, maximumConeAngle = 360) {
        this.createEllipsoid(viewer, name, position, new Cesium.Cartesian3(radius, radius, radius), innerRadius === undefined ? undefined : new Cesium.Cartesian3(innerRadius, innerRadius, innerRadius), material, withOutline, outlineColor, outlineWidth, minimumClockAngle, maximumClockAngle, minimumConeAngle, maximumConeAngle);
    }

    static createEllipsoid(viewer, name, position, radii, innerRadii, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1, minimumClockAngle = 0, maximumClockAngle = 360, minimumConeAngle = 0, maximumConeAngle = 360) {
        return viewer.entities.add({
            name: name,
            position: position,
            ellipsoid: {
                radii: radii,
                innerRadii: innerRadii,
                minimumClock: Cesium.Math.toRadians(minimumClockAngle),
                maximumClock: Cesium.Math.toRadians(maximumClockAngle),
                minimumCone: Cesium.Math.toRadians(minimumConeAngle),
                maximumCone: Cesium.Math.toRadians(maximumConeAngle),
                material: material,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
            },
        });
    }

    static createCorridor(viewer, name, positions, height, extrudedHeight, width, cornerType = Cesium.CornerType.BEVELED, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            corridor: {
                positions: positions,
                height: height,
                extrudedHeight: extrudedHeight,
                width: width,
                cornerType: cornerType,
                material: material,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
            },
        });
    }

    static createCylinder(viewer, name, position, length, topRadius, bottomRadius, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            position: position,
            cylinder: {
                length: length,
                topRadius: topRadius,
                bottomRadius: bottomRadius,
                material: material,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth
            },
        });
    }

    static createParallels(viewer, name, latitude, width, material = Cesium.Color.FUCHSIA) {
        return this.createPolyline(viewer, name, Cesium.Cartesian3.fromDegreesArray([
                -180,
                latitude,
                -90,
                latitude,
                0,
                latitude,
                90,
                latitude,
                180,
                latitude,
            ]), width, material);
    }

    static createMeridians(viewer, name, longitude, width, material = Cesium.Color.FUCHSIA) {
        return this.createPolyline(viewer, name, Cesium.Cartesian3.fromDegreesArray([
            longitude,
            90,
            longitude,
            0,
            longitude,
            -90,
        ]), width, material);
    }

    static createPlane(viewer, name, position, dimensions, fill = true, material= Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            position: position,
            plane: {
                plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
                dimensions: dimensions,
                fill: fill,
                material: material,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
            },
        });
    }

    static createPolygon(viewer, name, hierarchy, extrudedHeight = 0, arcType = Cesium.ArcType.RHUMB, fill = true, material= Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            polygon: {
                hierarchy: hierarchy,
                extrudedHeight: extrudedHeight,
                fill: fill,
                material: material,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
                arcType: arcType,
            },
        });
    }

    static createPolyline(viewer, name, positions, width, material, arcType = Cesium.ArcType.RHUMB, granularity) {
        return viewer.entities.add({
            name: name,
            polyline: {
                positions: positions,
                width: width,
                material: material,
                arcType: arcType,
                granularity: granularity,
                clampToGround: true,
            },
        });
    }

    static createPolylineVolume(viewer, name, positions, shape, cornerType = Cesium.CornerType.BEVELED, fill = true, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            polylineVolume: {
                positions: positions,
                shape: shape,
                cornerType: cornerType,
                fill: fill,
                material: material,
                outline: true,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
            },
        });
    }

    static createRectangle(viewer, name, coordinates, height, extrudedHeight = 0, rotationAngle = 0, fill = true, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            rectangle: {
                coordinates: coordinates,
                fill: fill,
                material: material,
                rotation: Cesium.Math.toRadians(rotationAngle),
                extrudedHeight: extrudedHeight,
                height: height,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
            },
        });
    }

    static createWall(viewer, name, positions, maximumHeights, minimumHeights, fill = true, material = Cesium.Color.FUCHSIA, withOutline = false, outlineColor = Cesium.Color.GREEN, outlineWidth = 1) {
        return viewer.entities.add({
            name: name,
            wall: {
                positions: positions,
                maximumHeights: maximumHeights,
                minimumHeights: minimumHeights,
                fill: fill,
                material: material,
                outline: withOutline,
                outlineColor: outlineColor,
                outlineWidth: outlineWidth,
            },
        });
    }
}
