d3.json("data/samples.json").then((sampleData) => {
    var names = sampleData.names
    console.log(names);

var selecttag = d3.select("#selDataset")

for(var i=0;i<names.length;i++) {

}
init()

