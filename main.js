const electron = require ('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// Set NODE_ENV = production
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow();
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when close
    mainWindow.on('closed', function(){
        app.quit();
    });
    
    // Build menu from templates
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create Add Window
function createAddWindow() {
    // create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Item'
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Optimizing programe here
    // Garbage collection handle
    addWindow.on('close',function(){
        addWindow = null;
    });
}

// Catch item:add
ipcMain.on('item:add',function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});
// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Item'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// if mac add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add Developer tools if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'command+I' : 'ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
             role: 'reload'
            }
        ]
    });
}