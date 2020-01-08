//Required modules
const vscode = require('vscode');
const clipboardy = require('clipboardy');

//Set error view
const showError = message => vscode.window.showErrorMessage(`Copy filename: ${message}`);
const showWarning = message => vscode.window.setStatusBarMessage(`${message}`, 3000);

exports.activate = context => {

    //Register command
    const copyFilename = vscode.commands.registerCommand('extension.copyFileName', (uri, files) => {
        let accumulator = '';

        if(typeof files !== 'undefined' && files.length > 0) {
            files.forEach((el, index) => {
                //get the relative url, parse it and take the last part
                let url = vscode.workspace.asRelativePath(el.path);
                let urlFormatted = url.replace(/\\/g, '/')
                accumulator += urlFormatted.split('/').pop();
                accumulator += (index == files.length -1) ? '' : '\n';
            });
        } else if(uri) {
            let url = vscode.workspace.asRelativePath(uri);
            let urlFormatted = url.replace(/\\/g, '/')
            accumulator += urlFormatted.split('/').pop();
        }

        //Copy the last part to clipboard
        clipboardy.write(accumulator).then(showWarning('Filename/s has been copied to clipboard'));
    });

    context.subscriptions.push(copyFilename);
}

exports.deactivate = () => { };
