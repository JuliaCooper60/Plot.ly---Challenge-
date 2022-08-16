d3.json("data/samples.json").then((sampleData) => {
    var names = sampleData.names
    console.log(names);
    var selecttag = d3.select("#selDataset")
    // create drop down list 
    for (var i = 0; i < names.length; i++) {
        selecttag.append("option").text(names[i]).property("value", names[i])
    };
})
//  Create table 
function metadata(id) {
    d3.json("data/samples.json").then((sampleData) => {
        var metadata = sampleData.metadata;
        console.log(metadata);
        var results = metadata.filter(obj => obj.id == id)[0];

        var panel = d3.select("#sample-metadata");
        panel.html("");
        for (key in results) {
            panel.append("").text(`${key}; ${results[key]}`);
        };
    });
}

function buildchart(id) {
    d3.json("data/samples.json").then((sampleData) => {
        var samples = sampleData.samples;
        console.log(samples);
        var results = samples.filter(obj => obj.id == id)[0];
        var ids = results.otu_ids;
        var labels = results.otu_labels;
        var values = results.sample_values;
        // var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()

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
        Plotly.newPlot("#bar", barSampleData, layoutBar);
    });

    // build bubble chart 

    var LayoutBubble = {
        margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
    };

    var DataBubble = [
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
    Plotly.newPlot("#bubble", DataBubble, LayoutBubble);
}
}
    function init() {
        d3.json("data/samples.json").then((sampleData) => {
            var names = sampleData.names;
            console.log(names);
            var selecttag = d3.select("#selDataset");
            // create drop down list 
            for (var i = 0; i < names.length; i++) {
                selecttag.append("option").text(names[i]).property("value", names[i])
            };
            metadata(names[0]);

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

