$(document).ready(function () {
    let dataInput = $("#dataInput");
    dataInput.keyup(function () {
        dataInput.val(dataInput.val().replace(/[^0-1]/, ''));
        UpdateList();
    });

    let sequenceInput = $("#sequenceInput");
    sequenceInput.keyup(function () {
        sequenceInput.val(sequenceInput.val().replace(/[^0-1]/, ''));
        UpdateList();
    });

    $("#frequencyInput").keyup(function () {
        UpdateList();
    });
});

function UpdateList() {
    let listElement = $("#timeList");
    listElement.html("");
    if ($("#dataInput").val() !== "" && $("#frequencyInput").val() !== "") {
        let list = DetectSequences();
        for (var i = 0; i < list.length; i++) {
            var listItem = document.createElement("li");
            listItem.innerHTML = list[i];
            listElement.append(listItem);
        }
    }
}

function DetectSequences() {
    let sequence = $("#sequenceInput").val();
    let data = $("#dataInput").val();
    let frequency = Number($("#frequencyInput").val());

    var list = [];

    let run = true;
    let removedChars = 0;
    while (run) {
        let index = data.indexOf(sequence);
        if (index === -1) {
            run = false;
        } else {
            list.push((index + 1 + removedChars) * (1 / frequency) + " seconds");
            data = data.substring(index + 1, data.length);
            removedChars += index + 1;
        }
    }

    return list;
}