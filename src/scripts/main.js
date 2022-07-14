/*global jQuery, d3, dagreD3, DAG */

(function () {
  "use strict";

  console.log("dagreD3:", dagreD3);

  /** @param {string} id
   * @returns {string | undefined} */
  const getNodeType = (id) => {
    const tokens = id.split("-");
    return tokens.length > 1 ? tokens[0] : undefined;
  };

  /** My own implementation */
  function customDrawNode(graph, u, root) {
    // Retrieve information
    // Rect has to be created before label so that it doesn't cover it!
    var labelEl = root.append("g").attr("class", "label");
    // const node = graph._nodes[u];
    const node = graph.node(u);
    const { state } = node;
    const nodeType = getNodeType(u);

    // Add the label
    addLabel(graph.node(u).label, labelEl, 10, 10);

    // Mark up the DOM with things we want to affect appearance
    const el = root[0][0];
    if (nodeType) el?.classList.add(`type-${nodeType}`);
    if (state !== undefined) el?.classList.add(`state-${state}`);
  }

  function addForeignObjectLabel(label, root) {
    var fo = root.append("foreignObject").attr("width", "100000");

    var w, h;
    fo.append("xhtml:div")
      .style("float", "left")
      // TODO find a better way to get dimensions for foreignObjects...
      .html(function () {
        return label;
      })
      .each(function () {
        w = this.clientWidth;
        h = this.clientHeight;
      });

    fo.attr("width", w).attr("height", h);
  }

  function addTextLabel(label, root) {
    root
      .append("text")
      .attr("text-anchor", "left")
      .append("tspan")
      .attr("dy", "1em")
      .text(function () {
        return label;
      });
  }

  function addLabel(label, root, marginX, marginY) {
    // Add the rect first so that it appears behind the label
    var rect = root.append("rect");
    var labelSvg = root.append("g");

    if (label[0] === "<") {
      addForeignObjectLabel(label, labelSvg);
      // No margin for HTML elements
      marginX = marginY = 0;
    } else {
      addTextLabel(label, labelSvg);
    }

    var bbox = root.node().getBBox();

    labelSvg.attr(
      "transform",
      "translate(" + -bbox.width / 2 + "," + -bbox.height / 2 + ")"
    );

    rect
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("x", -(bbox.width / 2 + marginX))
      .attr("y", -(bbox.height / 2 + marginY))
      .attr("width", bbox.width + 2 * marginX)
      .attr("height", bbox.height + 2 * marginY);
  }

  window.DAG = {
    displayGraph: function (graph, dagNameElem, svgElem) {
      dagNameElem.text(graph.name);
      this.renderGraph(graph, svgElem);
    },

    renderGraph: function (graph, svgParent) {
      var nodes = graph.nodes;
      var links = graph.links;

      var graphElem = svgParent.children("g").get(0);
      var svg = d3.select(graphElem);
      var renderer = new dagreD3.Renderer();
      renderer.drawNode(customDrawNode);
      var layout = dagreD3.layout().rankDir("LR");
      const json = dagreD3.json.decode(nodes, links);
      console.log("json:", json);
      renderer.layout(layout).run(json, svg.append("g"));

      // Adjust SVG height to content
      var main = svgParent.find("g > g");
      var h = main.get(0).getBoundingClientRect().height;
      var newHeight = h + 40;
      newHeight = newHeight < 800 ? 800 : newHeight;
      svgParent.height(newHeight);

      var w = main.get(0).getBoundingClientRect().width;
      var newWidth = newWidth < 800 ? 800 : newWidth;
      svgParent.width(900);

      // Zoom
      d3.select(svgParent.get(0)).call(
        d3.behavior.zoom().on("zoom", function () {
          var ev = d3.event;
          svg
            .select("g")
            .attr(
              "transform",
              "translate(" + ev.translate + ") scale(" + ev.scale + ")"
            );
        })
      );
    },
  };
})();

(function () {
  "use strict";

  // load data on dom ready
  jQuery(function () {
    // load script with graph data
    var fileName = window.location.search
      ? window.location.search.slice(1)
      : "example.js";
    console.log("fileName:", fileName);
    var dataScript = document.createElement("script");
    dataScript.src = fileName;
    document.body.appendChild(dataScript);
  });

  // callback for graph data loading
  window.loadData = function (data) {
    DAG.displayGraph(data, jQuery("#dag-name"), jQuery("#dag > svg"));
  };
})();
