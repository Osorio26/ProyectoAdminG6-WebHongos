async function button() {
   readFile();
}

async function readFile() {
    let await [file_handle] = window.showOpenFilePicker();
    let file_data = await file_handle.getFile();
    let file_text = file_handle.text();
    console.log("File content: ", file_text);
}