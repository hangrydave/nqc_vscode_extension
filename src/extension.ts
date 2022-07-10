import * as vscode from 'vscode';
import { Uri } from 'vscode';

function setupDownloadProgramCommand(context: vscode.ExtensionContext) {
}

function downloadProgram(filePath: string) {
    const nqcDownloadCmd = `nqc -Susb:/dev/usb/legousbtower0 -d ${filePath}`;

    console.log(nqcDownloadCmd);
    const { exec } = require('child_process');
    exec(nqcDownloadCmd, (error: Error, stdout: string, stderr: string) => {
        if (error) {
            console.error(`Error downloading program ${filePath}: ${error}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        // console.log("finished downloading program");
    });
}

export function activate(context: vscode.ExtensionContext) {
    const command = 'nqchighlighter.downloadProgram';

    const commandHandler = (programName: string = 'program') => {
        var workingDirectory: Uri;

        if (vscode.workspace.workspaceFolders) {
            workingDirectory = vscode.workspace.workspaceFolders[0]?.uri;
        } else {
            workingDirectory = vscode.Uri.file(process.cwd());
        }

        const options: vscode.OpenDialogOptions = {
            defaultUri: workingDirectory,
            canSelectMany: false,
            openLabel: 'Open',
            filters: {
                'NQC files': ['nqc'],
                'All files': ['*']
            }
        };

        vscode.window.showOpenDialog(options).then(fileUri => {
            if (fileUri && fileUri[0]) {
                console.log('Selected file: ' + fileUri[0].fsPath);
                downloadProgram(fileUri[0].fsPath);
            }
        });
    };

    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}