window.onload = function () {
    var cf = new ContentFetcher.contentFetcher(
        [0, 14],
        [{
                name: "lab 66: 期中計畫 Decision Tree Visualization",
                numberOrder: "66"
            },
            {
                name: "lab 99: 期末計畫  Choropleth Map 階級区分図",
                numberOrder: "99"
            }
        ]
    );
    var presentationTagName = ContentFetcher.presentation.register();
    var progressBarTagName = ContentFetcher.progressBar.register();
    var progressBar = document.createElement(progressBarTagName);
    document.body.appendChild(progressBar);
    document.body.style.overflow = "hidden";
    progressBar.setProgress({loaded: 0, total: 1, color: "#9ee9f7"});
    cf.checkAvailable(function (loaded, total) {
        progressBar.setProgress({loaded: loaded, total: total, color: "#9ee9f7"});
    })
    .then(function () {
        document.body.style.overflow = "auto";
        progressBar.remove();
        var checked = cf.checked;
        for (var i = 0; i < checked.length; i++) {
            var presentation = document.createElement(presentationTagName);
            presentation.setAttribute("title-name", checked[i].name + ":");
            presentation.setFrameInfo({
                width: "100%",
                height: 700,
                src: "./lab" + checked[i].numberOrder + "/index.html"
            });
            document.body.appendChild(presentation);
        }
    });
}