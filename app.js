d3.json("data/samples.json").then((sampleData) => {
    var names = sampleData.names
    console.log(names);
    var selecttag = d3.select("selDataset")
    // create drop down list 
    for (var i = 0; i < names.length; i++) {
        selecttag.append("option").text(names[i]).property("value", names[i])
    };
})
//  Create table 
function buildMetadata(id) {
    d3.json("data/samples.json").then((sampleData) => {
        var metadata = sampleData.metadata;
        console.log(metadata);
        var results = metadata.filter(obj => obj.id == id)[0];

        var panel = d3.select("#sample-metadata");
        panel.html("");
        for (key in results) {
            panel.append("h6").text(`${key}; ${results[key]}`);
        };
    });
}
// Build charts 
function buildCharts(id) {
    d3.json("data/samples.json").then((sampleData) => {
        var samples = sampleData.samples;
        var metadata = sampleData.metadata
        var results_metadata = metadata.filter(x=>x.id === parseInt(id))[0]
        console.log(samples);
        var results = samples.filter(obj => obj.id === id)[0];
        var ids = results.otu_ids;
        var labels = results.otu_labels;
        var values = results.sample_values;


        var barSampleData = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: values.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        // Build bar chart
        var layoutBar = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 },
        };

        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar", barSampleData, layoutBar);

        // build bubble chart 

        var dataBubble = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];

        var layoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "OTU (Operational Taxonomic Unit)ID from Sample" },
            hovermode: "closest",
        };
        Plotly.newPlot("bubble", dataBubble, layoutBubble);

        // build guage chart [OPTIONAL]

        // if wfreq has a null value, make it zero for calculating pointer later
        // var wfreq = 
        var wfreq = results_metadata.wfreq
        if (wfreq == null) {
            wfreq = 0;
        }

        // // create an indicator trace for the gauge chart
        var traceGauge = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {
                    range: [0, 9],
                    tickmode: "linear", 
                    tickfont: {
                        size: 15
                    },
                },
                bar: { color: "rgba(8,29,88,0)" }, // making gauge bar transparent since a pointer is being used instead
                steps: [
                    { range: [0, 1], color: "rgb(255,255,217)" },
                    { range: [1, 2], color: "rgb(237,248,217)" },
                    { range: [2, 3], color: "rgb(199,233,180)" },
                    { range: [3, 4], color: "rgb(127,205,187)" },
                    { range: [4, 5], color: "rgb(65,182,196)" },
                    { range: [5, 6], color: "rgb(29,145,192)" },
                    { range: [6, 7], color: "rgb(34,94,168)" },
                    { range: [7, 8], color: "rgb(37,52,148)" },
                    { range: [8, 9], color: "rgb(8,29,88)" }
                ]
            }
        }
        // determine angle for each wfreq segment on the chart
        var angle = (wfreq / 9) * 180;

        // calculate end points for triangle pointer path
        var degrees = 180 - angle,
            radius = .8;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // // Path: to create needle shape (triangle). Initial coordinates of two of the triangle corners plus the third calculated end tip that points to the appropriate segment on the gauge 
        // M aX aY L bX bY L cX cY Z
        var mainPath = "M -.0 -0.025 L .0 0.025 L ",
            cX = String(x),
            cY = String(y),
            pathEnd = "Z";
        var path = mainPath + cX + " " + cY + pathEnd;

        gaugeColors = ["rgb(8,29,88)", "rgb(37,52,148)", "rgb(34,94,168)", "rgb(29,145,192)", "rgb(65,182,196)", "rgb(127,205,187)", "rgb(199,233,180)", "rgb(237,248,217)", "rgb(255,255,217)", "white"]

        // create a trace to draw the circle where the needle is centered
        var traceNeedleCenter = {
            type: "scatter",
            showlegend: false,
            x: [0],
            y: [0],
            marker: { size: 35, color: "850000" },
            name: "wfreq",
            hoverinfo: "name"
        };

        // // create a data array from the two traces
        var dataGauge = [traceGauge, traceNeedleCenter];

        // define a layout for the chart
        var layoutGauge = {

            // draw the needle pointer shape using path defined above
            shapes: [{
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                    color: "850000"
                },
            }],
            font: {
                family: "Quicksand"
            },
            hoverlabel: {
                font: {
                    family: "Quicksand",
                    size: 16
                },
            },
            title: {
                text: `<b>Test Subject ${id}</b><br><b>Belly Button Washing Frequency</b><br><br>Scrubs per Week`,
                font: {
                    size: 18,
                    color: "rgb(34,94,168)"
                },
            },
            height: 500,
            width: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1],
                fixedrange: true // disable zoom
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-0.5, 1.5],
                fixedrange: true // disable zoom
            },
        };

        // plot the gauge chart
        Plotly.newPlot("gauge", dataGauge, layoutGauge);


    }); // close .then function

}; // close plotCharts() function

function init() {
    d3.json("data/samples.json").then((sampleData) => {
        var names = sampleData.names;
        console.log(names);
        var selecttag = d3.select("#selDataset");
        // create drop down list 
        for (var i = 0; i < names.length; i++) {
            selecttag.append("option").text(names[i]).property("value", names[i])
        };
        buildMetadata(names[0]);

        // Use the first sample from the list to build the initial plots
        const firstSample = names[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);

    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);

}


init()

