(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
    var cols = [{
        id: "id",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "mag",
        alias: "magnitude",
        dataType: tableau.dataTypeEnum.float
    }, {
        id: "url",
        alias: "url enlace contenido",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "title",
        alias: "title",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "lat",
        dataType: tableau.dataTypeEnum.float
    }, {
        id: "lon",
        dataType: tableau.dataTypeEnum.float
    }, {
        id: "depth",
        dataType: tableau.dataTypeEnum.float
    }];

    var tableSchema = {
        id: "earthquakeFeed",
        alias: "Earthquakes con magnitud superior a los 4.5 en los ultimos 7 dias",
        columns: cols
    };

    schemaCallback([tableSchema]);
};

    myConnector.getData = function(table, doneCallback) {
    $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
        var feat = resp.features,
            tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = feat.length; i < len; i++) {
            tableData.push({
                "id": feat[i].id,
                "mag": feat[i].properties.mag,
				"url": feat[i].properties.url,
                "title": feat[i].properties.title,
                "lat": feat[i].geometry.coordinates[0],
				"lon": feat[i].geometry.coordinates[1],
				"depth": feat[i].geometry.coordinates[2]
            });
        }

        table.appendRows(tableData);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "USGS Earthquake Feed";
        tableau.submit();
    });
});
