//Required modules
const vscode = require('vscode');
const path = require('path');

/**
 * @param {string} message
 */
const showError = message => vscode.window.showErrorMessage(`Copy filename: ${message}`);
/**
 * @param {string} message
 */
const showWarning = message => vscode.window.setStatusBarMessage(`${message}`, 3000);

/**
 * @callback registerCommand
 * @param {vscode.Uri} uri
 * @param {vscode.Uri[]=} [files]
 */

/**
 * @param {vscode.ExtensionContext} context
 */
exports.activate = context => {
    //Register context menu commands
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.copyFileName',
            /** @type {registerCommand} */
            (uri, files) => doCopy(getUris(uri, files), true),
        ),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.copyFileNameNoExtension',
            /** @type {registerCommand} */
            (uri, files) => doCopy(getUris(uri, files), false),
        ),
    );

    //Register command pallette commands
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.copyFileNameOfActiveFile',
            () => doCopy(getActiveUri(), true),
        ),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.copyFileNameNoExtensionOfActiveFile',
            () => doCopy(getActiveUri(), false),
        ),
    );
}

exports.deactivate = () => { };

/**
 * @param {vscode.Uri} uri
 * @param {vscode.Uri[]=} [files]
 * @returns {vscode.Uri[]}
 */
function getUris(uri, files) {
    if(typeof files !== 'undefined' && files.length > 0) {
        return files;
    }
    return [uri];
}

/**
 * @returns {vscode.Uri[]=}
 */
function getActiveUri() {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (typeof activeTextEditor === 'undefined') {
        return;
    }
    return [activeTextEditor.document.uri];
}

/**
 * @param {vscode.Uri[]} uris
 * @param {boolean} includeExtension
 * @returns {void}
 */
function doCopy(uris, includeExtension) {
    const accumulator = uris
        .map(uri => getFilename(uri, includeExtension))
        .join('\n');
    //Copy text to the clipboard
    vscode.env.clipboard.writeText(accumulator)
        .then(showWarning(`Filename${uris.length > 1 ? 's' : ''} has been copied to clipboard`));
}

/**
 * @param {vscode.Uri} uri
 * @param {boolean} includeExtension
 */
function getFilename(uri, includeExtension) {
    const relative = vscode.workspace.asRelativePath(uri);
    const parsed = path.parse(relative);

    if(includeExtension) {
        return parsed.base;
    }
    return parsed.name;
}
