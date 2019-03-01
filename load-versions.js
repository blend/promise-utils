var request = new XMLHttpRequest();
request.open('GET', 'versions.json', true);

request.onload = function() {
    if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        var listElement = document.getElementById('version-list');
        for (var i = 0; i < data.length; i++) {
            var version = data[i];

            var anchorNode = document.createElement("a");
            anchorNode.href = version + '/index.html';
            anchorNode.text = version;

            var liNode = document.createElement("li");
            liNode.appendChild(anchorNode);

            listElement.appendChild(liNode);
        }
    }
};

request.send();
