$(document).ready(function () {
    let dataInput1 = $("#dataInput1");
    dataInput1.focus();
    dataInput1.keyup(function () {
        dataInput1.val(dataInput1.val().replace(/[^0-1]/, ''));
        UpdateList();
    });

    let dataInput2 = $("#dataInput2");
    dataInput2.keyup(function () {
        dataInput2.val(dataInput2.val().replace(/[^0-1]/, ''));
        UpdateList();
    });

    let dataInput3 = $("#dataInput3");
    dataInput3.keyup(function () {
        dataInput3.val(dataInput3.val().replace(/[^0-1]/, ''));
        UpdateList();
    });

    let dataInput4 = $("#dataInput4");
    dataInput4.keyup(function () {
        dataInput4.val(dataInput4.val().replace(/[^0-1]/, ''));
        UpdateList();
    });

    let sequenceInput = $("#sequenceInput");
    sequenceInput.keyup(function () {
        sequenceInput.val(sequenceInput.val().replace(/[^0-1]/, ''));
        //UpdateList();
        parseLargeInput($("#largeInput").val());
    });

    $("#frequencyInput").keyup(function () {
        //UpdateList();
        parseLargeInput($("#largeInput").val());
    });

    $("#largeInput").keyup(function () {
        parseLargeInput($("#largeInput").val());
    });
});

function parseLargeInput(text) {
    let lines = text.split('\n');
    let length = 0;
    let waveDromText = "";

    let listElement = $("#timeList");
    let frequency = Number($("#frequencyInput").val());
    listElement.html("");
    $("#WaveDrom_Display_0").remove();

    if (frequency === 0) {
        return;
    }

    for (let i = 0; i < lines.length; i += 2) {
        let label = lines[i];
        let data = lines[i + 1];

        let detectionList = DetectSequences(data);
        let wave = ProduceWave(data);
        wave = "xx" + wave;

        let sequenceWave = ProduceWave(GetSequence(wave, detectionList));

        wave = wave + "xx";

        length = Math.max(wave.length, length);

        waveDromText += "  { name: \"" + label + "\",  wave: \"" + wave + "\", phase: \"1.0\" },\n" +
            "  { name: \"Sequence " + label + "\",  wave: \"" + sequenceWave + "\" },\n";
    }

    let clk = "P";
    //Generate clock data
    for (let i = 0; i < length; i++) {
        clk += ".";
    }

    waveDromText = "{ signal : [\n" +
        "  { name: \"clk\",  wave: \"" + clk + "\" },\n" +
        waveDromText + "], \n" +
        "head: {\n" +
        "tick: -1, \n" +
        "}, \n" +
        "}";
    $("#InputJSON_0").html(waveDromText);
    WaveDrom.ProcessAll(lines);

    DrawTable(lines);
}

function DrawTable(lines) {
    let table = $("#timeTable");

    table.html("");
    let headerRow = document.createElement("tr");
    let cell = document.createElement("th");
    cell.innerHTML = "puls";
    headerRow.append(cell);

    let detections = [];
    let length = 0;

    for (let i = 0; i < lines.length; i += 2) {
        let detect = DetectSequences(lines[i + 1]);
        detections[i] = detect;
        length = Math.max(length, detect.length);
    }

    for (let i = 0; i < lines.length; i += 2) {
        cell = document.createElement("th");
        cell.innerHTML = lines[i];
        headerRow.append(cell);
    }

    table.append(headerRow);
    let frequency = Number($("#frequencyInput").val());

    for (let i = 0; i < length; i++) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.innerHTML = i + 1;
        row.append(cell);
        for (let j = 0; j < lines.length; j += 2) {
            cell = document.createElement("td");
            cell.innerHTML = (detections[j][i] * (1 / frequency)).toFixed(3) + " seconds";
            if (cell.innerHTML === "NaN seconds") {
                cell.innerHTML = "";
            }
            row.append(cell);
        }
        table.append(row);
    }
}

function UpdateList() {
    let listElement = $("#timeList");
    let frequency = Number($("#frequencyInput").val());
    let data1 = $("#dataInput1").val().trim();
    listElement.html("");
    $("#WaveDrom_Display_0").remove();
    if (data1 !== "" && frequency !== 0) {
        let list = DetectSequences(data1);
        for (let i = 0; i < list.length; i++) {
            let listItem = document.createElement("li");
            listItem.innerHTML = (list[i] * (1 / frequency)).toFixed(3) + " seconds";
            listElement.append(listItem);
        }
        RenderWaveForm();
    }
}

function DetectSequences(data) {
    let sequence = $("#sequenceInput").val();

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
    let data1 = $("#dataInput1").val().trim();
    let data2 = $("#dataInput2").val().trim();
    let data3 = $("#dataInput3").val().trim();
    let data4 = $("#dataInput4").val().trim();

    //Get list of detected sequences
    let list1 = DetectSequences(data1);
    let list2 = DetectSequences(data2);
    let list3 = DetectSequences(data3);
    let list4 = DetectSequences(data4);

    //Beautify waves
    data1 = ProduceWave(data1);
    data2 = ProduceWave(data2);
    data3 = ProduceWave(data3);
    data4 = ProduceWave(data4);

    data1 = "xx" + data1; //The wave showing the input data
    data2 = "xx" + data2;
    data3 = "xx" + data3;
    data4 = "xx" + data4;

    let length = Math.max(data1.length, data2.length, data3.length, data4.length);

    for (let i = 0; i < length; i++) {
        clk += ".";
    }

    //Draw sequence waveforms
    let sequence1 = ProduceWave(GetSequence(data1, list1));
    let sequence2 = ProduceWave(GetSequence(data2, list2));
    let sequence3 = ProduceWave(GetSequence(data3, list3));
    let sequence4 = ProduceWave(GetSequence(data4, list4));

    data1 += "xx";
    data2 += "xx";
    data3 += "xx";
    data4 += "xx";

    el.html("{ signal : [\n" +
        "  { name: \"clk\",  wave: \"" + clk + "\" },\n" +
        "  { name: \"Data 1\",  wave: \"" + data1 + "\", phase: \"1.0\" },\n" +
        "  { name: \"Sequence Detected 1\",  wave: \"" + sequence1 + "\" },\n" +
        "  { name: \"Data 2\",  wave: \"" + data2 + "\", phase: \"1.0\" },\n" +
        "  { name: \"Sequence Detected 2\",  wave: \"" + sequence2 + "\" },\n" +
        "  { name: \"Data 3\",  wave: \"" + data3 + "\", phase: \"1.0\" },\n" +
        "  { name: \"Sequence Detected 3\",  wave: \"" + sequence3 + "\" },\n" +
        "  { name: \"Data 4\",  wave: \"" + data4 + "\", phase: \"1.0\" },\n" +
        "  { name: \"Sequence Detected 4\",  wave: \"" + sequence4 + "\" },\n" +
        "], \n" +
        "head: {\n" +
        "tick: -1, \n" +
        "}, \n" +
        "}");
    WaveDrom.ProcessAll()
}

/**
 * @return {string}
 */
function GetSequence(data, list) {
    let sequence = "0"; //The wave showing where the sequences where detected
    for (let i = 0; i < data.length; i++) {
        if (list.includes(i)) {
            sequence += "1";
        } else {
            sequence += "0";
        }
    }
    return sequence;
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