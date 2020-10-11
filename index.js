const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
var public = new Object();

const server = "hazel.ryanwans.vercel.app";
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

// autoUpdater.setFeedURL(feed)

var USEDEVTOOLS = true;

function createLauncher() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      devTools: USEDEVTOOLS,
      disableHtmlFullscreenWindowResize: true,
      resizable: false,
      title: "Test Caplet Viewer",
      fullscreen: false,
      enableRemoteModule: true,
      ico: './hard/icon.ico'
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
  
  // Make instance public for closure
  public['win'] = win;
}

function createTeacher() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: USEDEVTOOLS,
      disableHtmlFullscreenWindowResize: true,
      resizable: false,
      title: "Test Caplet Teacher",
      fullscreen: false,
      enableRemoteModule: true,
      ico: './hard/ICON.ico'
    }
  })
  win.setResizable(false);
  win.setFullScreenable(false);
  // and load the index.html of the app.
  win.loadFile('./views/teacher.html');

  var template = [{label: "Menu", 
    submenu: [{
        label: 'Close App',
        accelerator: process.platform == "darwin" ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
    }]}, {label: 'Help', submenu: [{label: 'For help, visit the Test Caplet website.'}]}
  ];
  var overrideMenu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(overrideMenu);
  
  // Make instance public for closure
  public['teacher'] = win;

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}
function createStudent() {
  console.log("STUDENT")
}

ipcMain.on('win-raster-student', (event, arg) => {
  createStudent();
  public.auth = arg.push;
  public.win.destroy();
});
ipcMain.on('win-raster-teacher', (event, arg) => {
  createTeacher();
  public.auth = arg.push;
  public.win.destroy();
});
ipcMain.on('grab-auth', (event, arg) => {
  event.reply('return-auth', public.auth);
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createLauncher)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    app.quit()
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
