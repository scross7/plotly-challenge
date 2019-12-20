async function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  // terminal output for json sample_metadata : {
  //   'sample': 940, 
  //   'ETHNICITY': 
  //   'Caucasian', 
  //   'GENDER': 'F', 
  //   'AGE': 24.0, 
  //   'LOCATION': 'Beaufort/NC', 
  //   'BBTYPE': 'I', 
  //   'WFREQ': 2.0}

  const url = "/metadata/" + sample;
  console.log(url);

  metadata = await d3.json(url);
  console.log(metadata);

  // Use `.html("") to clear any existing metadata
  d3.select('#sample-metadata').html('').append('ul');

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  for (let [key, value] of Object.entries(metadata)) {
    d3.select('ul', '#sample-metadata').append('li').text(`${key}: ${value}`);
    console.log(`${key}: ${value}`);
  };

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    // Enter a speed between 0 and 180
    var level = metadata.WFREQ*(180/9);

    // Trig to calc meter point
    var degrees = 180 - level,
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    // for values in var data = [{}]
    first = 30
    second = 9

    var data = [{
      type: 'scatter',
      x: [0], y: [0],
      marker: { size: 28, color: '850000' }, // size:28
      showlegend: false,
      name: 'scrubs',
      text: level,
      hoverinfo: 'name'
    },
    {
      values: [
        first / second  // 1
        ,first / second // 2
        ,first / second // 3
        ,first / second // 4
        ,first / second // 5
        ,first / second // 6
        ,first / second // 7
        ,first / second // 8
        ,first / second // 9
        ,first          // 10
      ],
      rotation: 90,
      text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1'],
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['rgba(178, 226, 206, .5)', 
                'rgba(208, 230, 146, .5)',
                'rgba(156, 209, 187, .5)',
                'rgba(138, 218, 179, .5)', 
                'rgba(178, 216, 187, .5)', 
                'rgba(177, 224, 185, .5)', 
                'rgba(166, 213, 144, .5)',
                'rgba(240, 225, 157, .5)', 
                'rgba(208, 230, 146, .5)',
                'rgba(216, 226, 106, 0)']
      },
      labels: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week',
      height: 700,
      width: 700,
      xaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      },
      yaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      }
    };

    Plotly.newPlot('gauge', data, layout);
  }

  async function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    const url = "/samples/" + sample;
    console.log(url);
  
    sampledata = await d3.json(url);
    console.log(sampledata);

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sampledata.otu_ids,
      y: sampledata.sample_values,
      text: sampledata.otu_labels,
      mode: 'markers',
      marker: {
        // color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        size: sampledata.sample_values
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
      height: 600,
      width: 1000
    };

    Plotly.newPlot('bubble', data, layout);

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  var data = [{
    values: sampledata.sample_values.slice(0, 10),
    labels: sampledata.otu_ids.slice(0, 10),
    type: 'pie'
  }];

  var layout = {
    height: 400,
    width: 400
  };

  Plotly.newPlot('pie', data, layout);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
