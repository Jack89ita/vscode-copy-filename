//Required modules
const vscode = require('vscode');
const clipboardy = require('clipboardy');
const $path = require('path');

//Set error view
// const showError = message => vscode.window.showErrorMessage(`Copy filename: ${message}`);
const showWarning = message => vscode.window.setStatusBarMessage(`${message}`, 3000);
// const output = vscode.window.createOutputChannel('copy-filename');
exports.activate = context => {

    //Register command
    const copyFilename = vscode.commands.registerCommand('extension.copyFileName', (uri, files) => {
        vscode.window.showInputBox({
            placeHolder: 'File name separator (\\n as default)'
        }).then(separator => {
            separator =  separator || '\n'
            let accumulator = '';

            vscode.window.showQuickPick(['yes', 'no'], {
                placeHolder: 'Remove file extension?',
                onDidSelectItem: item => {
                    const noExt = String(item).toLowerCase() === 'yes';
                    if(typeof files !== 'undefined' && files.length > 0) {
                        files.forEach((el, index) => {
                            //get the relative url, parse it and take the last part
                            let url = vscode.workspace.asRelativePath(el.path);
                            let urlFormatted = url.replace(/\\/g, '/');
                            let filename = urlFormatted.split('/').pop();
                            if (noExt) filename = removeExt(filename);
                            accumulator += filename;
                            accumulator += (index == files.length -1) ? '' : separator;
                        });
                    } else if(uri) {
                        let url = vscode.workspace.asRelativePath(uri);
                        let urlFormatted = url.replace(/\\/g, '/')
                        let filename = urlFormatted.split('/').pop();
                        if (noExt) filename = removeExt(filename);
                        accumulator += filename;
                    }

                    //Copy the last part to clipboard
                    // output.appendLine(`files(${files.length}): ${accumulator}`);
                    clipboardy.write(accumulator).then(showWarning('Filename(s) has been copied to clipboard'));
                }
            });
        });
    });

    context.subscriptions.push(copyFilename);
}

function removeExt(filename) {
    return $path.basename(filename, $path.extname(filename));
}

exports.deactivate = () => { };
