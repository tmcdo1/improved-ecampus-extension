// Add listener for toggling if the style 
var styleOn = true

function toggleStyles() {
    browser.storage.local.set({
        style: !styleOn
    }).then(() => console.log('Styles toggled'), err => console.error(err))
}

browser.browserAction.onClicked.addListener(toggleStyles)