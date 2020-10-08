const { app, BrowserWindow, Menu } = require('electron')

function createLauncher() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      disableHtmlFullscreenWindowResize: true,
      resizable: false,
      title: "Test Caplet Viewer",
      fullscreen: false,
      enableRemoteModule: true
    }
  })
  win.setResizable(false);
  win.setFullScreenable(false);
  // and load the index.html of the app.
  win.loadFile('./views/launch.html');

  var template = [{label: "Menu", 
    submenu: [{label: 'App Loading...'}, {type: 'separator'},{
        label: 'Close App',
        accelerator: process.platform == "darwin" ? 'Command+Q' : 'Ctrl+Q',
        click() {
            app.quit();
        }
    }]}, {label: 'App Loading...', submenu: [{label: ''}]}
  ];
  var overrideMenu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(overrideMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createLauncher)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createLauncher()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
