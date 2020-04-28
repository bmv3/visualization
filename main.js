navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

navigator.getUserMedia({ audio: true, video: false },
  function(stream) {
    var AudioContext = window.AudioContext || window.webkitAudioContext,
      ctx = new AudioContext(),
      source = ctx.createMediaStreamSource(stream),
      analyser = ctx.createAnalyser(),
      processor = ctx.createScriptProcessor(2048, 1, 1),
      data,
      chart,
      dataSource;

    source.connect(analyser);
    source.connect(processor);
    //analyser.connect(ctx.destination);
    processor.connect(ctx.destination);

    chart = $("#chart").dxChart({
      dataSource: [],
      legend: {
        visible: false
      },
      argumentAxis: {
        label: {
          visible: false
        }
      },
      valueAxis: {
        grid: {
          visible: false
        },
        label: {
          visible: false
        }
      },
      series: {
        hoverMode: "none",
        type: "bar",
        color: "#1E90FF"
      }
    }).dxChart("instance");
    data = new Uint8Array(analyser.frequencyBinCount);
    processor.onaudioprocess = function() {
      analyser.getByteFrequencyData(data);
      dataSource = $.map(data, function(item, index) {
        return { arg: index, val: item };
      });
      chart.option("dataSource", dataSource);
    }
  },
  function(error) {
    //error processing
  }
);