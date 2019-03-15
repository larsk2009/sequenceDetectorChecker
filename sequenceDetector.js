$(document).ready(function () {
    let dataInput = $("#dataInput");
    dataInput.focus();
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
    let frequency = Number($("#frequencyInput").val());
    listElement.html("");
    $("#WaveDrom_Display_0").remove();
    if ($("#dataInput").val() !== "" && $("#frequencyInput").val() !== "") {
        let list = DetectSequences();
        for (let i = 0; i < list.length; i++) {
            let listItem = document.createElement("li");
            listItem.innerHTML = list[i] * (1 / frequency) + " seconds";
            listElement.append(listItem);
        }
        RenderWaveForm();
    }
}

function DetectSequences() {
    let sequence = $("#sequenceInput").val();
    let data = $("#dataInput").val();

    let list = [];

    let run = true;
    let removedChars = 0;
    while (run) {
        let index = data.indexOf(sequence);
        if (index === -1) {
            run = false;
        } else {
            list.push((index + removedChars + sequence.length));
            data = data.substring(index + 1, data.length);
            removedChars += index + 1;
        }
    }

    return list;
}

function RenderWaveForm() {
    let el = $("#InputJSON_0");
    let clk = "P";
    let data = $("#dataInput").val().trim();
    for(let i = data.length - 1; i > 0; i--) {
        if(data[i] == data[i-1]) {
            data = data.replaceAt(i, ".");
        }
    }
    data = "xx" + data; //The wave showing the input data
    for(let i = 0; i < data.length; i++) {
        clk += ".";
    }

    let list = DetectSequences();

    let sequence = "0"; //The wave showing where the sequences where detected
    for(let i = 0; i < data.length ; i++) {
        if(list.includes(i)) {
            sequence += "1";
        } else {
            sequence += "0";
        }
    }

    sequence = ProduceWave(sequence);

    data += "xx";

    el.html("{ signal : [\n" +
        "  { name: \"clk\",  wave: \"" + clk + "\" },\n" +
        "  { name: \"Data\",  wave: \"" + data +"\", phase: \"1.0\" },\n" +
        "  { name: \"Sequence Detected\",  wave: \"" + sequence +"\" },\n" +
        "], \n" +
        "head: {\n" +
        "tick: -1, \n" +
        "}, \n" +
        "}");
    WaveDrom.ProcessAll()
}

function ProduceWave(data) {
    for(let i = data.length - 1; i > 0; i--) {
        if(data[i] == data[i-1]) {
            data = data.replaceAt(i, ".");
        }
    }

    return data;
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}