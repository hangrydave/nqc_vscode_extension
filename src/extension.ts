import * as vscode from 'vscode';

class DownloadOutput {
    readonly stdout: string;
    readonly stderr: string;
    readonly error: Error;

    constructor(stdout: string, stderr: string, error: Error) {
        this.stdout = stdout;
        this.stderr = stderr;
        this.error = error;
    }
}

function downloadProgram(filePath: string): Promise<DownloadOutput> {
    const nqcDownloadCmd = `nqc -Susb:/dev/usb/legousbtower0 -d ${filePath}`;

    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec(nqcDownloadCmd, (error: Error, stdout: string, stderr: string) => {
            const output = new DownloadOutput(stdout, stderr, error);
            resolve(output);
        })
    });
}

export function activate(context: vscode.ExtensionContext) {
    const command = 'nqchighlighter.downloadProgram';

    const commandHandler = () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || activeEditor.document.languageId != 'nqc') {
            return vscode.window.showInformationMessage("Cannot find open NQC file to download");
        }

        vscode.window.showInformationMessage("Downloading NQC file to RCX...");

        let fileToDownload: string = activeEditor.document.uri.fsPath;
        downloadProgram(fileToDownload).then(output => {
            if (output.error) {
                vscode.window.showInformationMessage(`Error downloading NQC file: ${output.error.message}`);
                return;
            }

            vscode.window.showInformationMessage(`${output.stdout}`);
        });
    };

    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}