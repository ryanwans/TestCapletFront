const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
var checkInternet = require("check-internet-connected");
var path =require('path');
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
var public = new Object();

const server = "hazel.ryanwans.vercel.app";
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

var icon = path.join(__dirname, 'build/icon.png');

// autoUpdater.setFeedURL(feed)

var leaseExists;
var leaseFile;
var lease; 

try {
  leaseFile = fs.readFileSync('./TestCaplet_Lease.txt', {root: __dirname});
  leaseExists = 1;
} catch(e) {
  leaseExists = 0;
}
if(!leaseExists) {
  var LEASE = uuidv4();
  console.log("Administering new lease...");
  fs.writeFileSync('./TestCaplet_Lease.txt', LEASE, {root: __dirname});
  lease = LEASE;
} else {
  console.log("Lease Detected.");
  lease = leaseFile.toString();
}
console.log("\n\nActive Lease >>   "+lease+"\n\n");
public.lease = lease;


var USEDEVTOOLS = true;


console.log("Rasterizing Test Caplet window version "+app.getVersion());
public.version = app.getVersion();

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
      ico: './build/icon.ico',
      icon: icon
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

  const config = {
    timeout: 5000, //timeout connecting to each try (default 5000)
    retries: 3,//number of retries to do before failing (default 5)
    domain: 'google.com'//the domain to check DNS record of
  }

  var internet = false;
  checkInternet(config)
    .then(() => {
      console.log("Internet connection detected and approved.");          
      internet = true;
    }).catch((err) => {
      console.log("No connection");
      internet = false;
    });

    ipcMain.on("get-internet", (event, arg) => {
      event.reply('internet-status', internet);
    });
    win.on('close', (e) => {
      ipcMain.on('continue-close', (a,b) => {
        app.quit();
      })
      win.webContents.send('try-window-close');
    })
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
      ico: './build/icon.ico',
      icon: icon
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

  win.on('close', (e) => {
    ipcMain.on('continue-close', (a,b) => {
      app.quit();
    })
    win.webContents.send('try-window-close');
  })
}
function createStudent() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: USEDEVTOOLS,
      disableHtmlFullscreenWindowResize: true,
      resizable: false,
      title: "Test Caplet",
      fullscreen: false,
      enableRemoteModule: true,
      ico: './build/icon.ico',
      icon: icon
    }
  })
  win.setResizable(false);
  win.setFullScreenable(false);
  // and load the index.html of the app.
  win.loadFile('./views/TestViewer.html');

  var template = [{label: "Menu", 
    submenu: [{
        label: 'Close App',
        accelerator: process.platform == "darwin" ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
    }]}
  ];
  var overrideMenu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(overrideMenu);
  
  // Make instance public for closure
  public['student'] = win;

  win.on('close', (e) => {
    ipcMain.on('continue-close', (a,b) => {
      app.quit();
    })
    win.webContents.send('try-window-close');
  })
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
ipcMain.on('set-test-meta', (event, arg) => {
  public.test = arg;
})
ipcMain.on('get-test-meta', (event, arg) => {
  event.reply('return-meta', public.test);
})
ipcMain.on('version', (event, arg) => {
  event.reply('on-version', public.version);
})
ipcMain.on('get-lease', (event, arg) => {
  event.reply("return-lease", public.lease);
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
    createLauncher();

  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
