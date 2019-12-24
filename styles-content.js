// ==UserScript==
// @name         Blackboard: simplification
// @namespace    http://tmcd.me/
// @downloadURL  https://raw.githubusercontent.com/tmcdo1/improved-ecampus-extension/master/styles-content.js
// @version      0.526
// @description  Remove excessive content
// @author       Thomas McDonald
// @match        https://tamu.blackboard.com/webapps/*
// @grant        GM_addStyle
// ==/UserScript==

function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

function onError(error) {
    console.error(error)
}

async function getCourseOrgObjects(serviceLevel) {
    let courseResponse = await fetch(`https://tamu.blackboard.com/webapps/blackboard/execute/globalCourseNavMenuSection?cmd=view&serviceLevel=blackboard.data.course.Course$ServiceLevel:${serviceLevel}`, {
        "credentials": "include",
        "headers": {
            "User-Agent": navigator.userAgent,
            "Accept": "text/javascript, text/html, application/xml, text/xml, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": "1.7"
        },
        "referrer": "https://tamu.blackboard.com/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_25_1",
        "method": "GET",
        "mode": "cors"
    })

    let courseHTMLString = await courseResponse.text()
    let courseHTML = document.createElement('div')
    courseHTML.innerHTML = courseHTMLString

    // let courses = Array.prototype.concat(...Array.from(document.getElementsByClassName('courses')).map(ul => Array.from(ul.children).map(li => { return {
    //     name: li.innerText.trim(), 
    //     link: li.children[0]
    // }})))

    return Array.prototype.concat(...Array.from(courseHTML.getElementsByClassName('courses')).map(ul => Array.from(ul.children).map(li => { return {
        name: li.innerText.trim(), 
        link: li.children[0]
    }})))
}

async function getUpdateAndGradeCount() {
    // TODO: Update to grab the sessionId, etc for the "body"
    let response = await fetch("https://tamu.blackboard.com/webapps/portal/dwr_open/call/plaincall/ToolActivityService.getActivityForAllTools.dwr", {
        "credentials": "include",
        "headers": {
            "User-Agent": navigator.userAgent,
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Suppress-Session-Timestamp-Update": "true",
            "Content-Type": "text/plain"
        },
        "referrer": "https://tamu.blackboard.com/webapps/portal/execute/tabs/tabAction?tabId=_4190_1&tab_tab_group_id=_25_1",
        "body": "callCount=1\npage=/webapps/portal/execute/tabs/tabAction?tabId=_4190_1&tab_tab_group_id=_25_1\nhttpSessionId=D6EEDA8A6EB132762462DBCE31E1682A\nscriptSessionId=8A22AEE4C7B3F9CA3A094735175A6B14350\nc0-scriptName=ToolActivityService\nc0-methodName=getActivityForAllTools\nc0-id=0\nc0-param0=boolean:true\nbatchId=0\n",
        "method": "POST",
        "mode": "cors"
    })

    let objectString = await response.text()
    objectString = /\{.*\}/g.exec(objectString)[0]
    let jsonStr = objectString.replace(new RegExp("'", 'g'), '"')
    // TODO: add quotes around the keys

    console.log(eval(jsonStr))
    return JSON.parse(jsonStr)
}

async function runAsyncActions() {

    const updatesKey = 'AlertsOnMyBb_____AlertsTool'
    const gradesKey = 'MyGradesOnMyBb_____MyGradesTool'
    
    getCourseOrgObjects('FULL').then(courses => {
        //  Add courses to dropdown
        console.log('Courses:', courses)

    }).catch(onError)

    getCourseOrgObjects('COMMUNITY').then(orgs => {
        // Add orgs to to dropdown

    }).catch(onError)

    getUpdateAndGradeCount().then(counts => {
        // Add counts to notifications and grade links

    }).catch(onError)

}

function main() {
    let name = document.getElementById('global-nav-link').childNodes[1].nodeValue.trim()
    // let homeURL = document.getElementById('eCampus').children[0].baseURI
    let homeURL = 'https://tamu.blackboard.com/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_25_1'

    // let gradeAtag = document.getElementById('MyGradesOnMyBb_____MyGradesTool')
    let gradeURL = '/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=MyGradesOnMyBb_____MyGradesTool'
    
    let updateAmount = document.getElementById('badgeTotalCount') // Number of updates
    let updateURL = '/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=AlertsOnMyBb_____AlertsTool'

    let logoutAtag = document.getElementById('topframe.logout.label')
    
    runAsyncActions()

    
    GM_addStyle('.base1 { flex-basis: 1px; }')
    GM_addStyle('#div_4_1 { flex-grow: 2; }')
    GM_addStyle('#div_5_1 { flex-grow: 1; }')
    GM_addStyle('#div_1_1 { flex-grow: 1; }')
    
    // Modify how list items are displayed for classes and organizations
    GM_addStyle(`.portletList-img.courseListing > li {
        margin-top: 24px;
        margin-bottom: 8px;
        text-align: left;
        padding: 0px 12px 0px 12px;
    }`)
    
    // Generic CSS
    GM_addStyle('.flex { display: flex; }')
    
    GM_addStyle(`.card {
        text-align: center;
        margin: 12px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        background: white;
        max-width: 700px;
        padding: 12px;
        border-radius: 24px;
    }`)

    // Set background for page to a nice gradient
    GM_addStyle('body { background-image: linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%); }')

    // Remove quick links
    GM_addStyle('#quick_links_wrap { display: none; }')

    // Hide old elements
    GM_addStyle('.locationPane, #globalNavPageNavArea table { display: none; }')

    // Header 
    GM_addStyle(`#topFrame, .bgBanner {
        background-color:transparent;
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
        box-shadow: none;
    }`)

    let homeLink = document.createElement('a')
    homeLink.setAttribute('href', homeURL)
    homeLink.innerText = name

    let nav = document.createElement('nav')
    nav.id = 'new-nav'
    nav.appendChild(homeLink)

    GM_addStyle(`#new-nav {
        height: 100px;
        justify-content: center;
        display: flex;
        align-items: center;
    }`)

    GM_addStyle(`#new-nav > a {
        color: black;
    }`)

    document.getElementById('globalNavPageNavArea').appendChild(nav)

    //  Home Page modifications
    if (window.location.href == homeURL) {
        let coursePanel = document.getElementById('div_4_1')
        let orgPanel = document.getElementById('div_5_1')
        let announcementPanel = document.getElementById('div_1_1')
    
        coursePanel.classList.add('card')
        coursePanel.classList.add('base1')
        orgPanel.classList.add('card')
        orgPanel.classList.add('base1')
        announcementPanel.classList.add('card')
        announcementPanel.classList.add('base1')

        let dashboard = document.createElement('div')
        dashboard.classList.add('flex')
        dashboard.appendChild(coursePanel)
        dashboard.appendChild(orgPanel)
        dashboard.appendChild(announcementPanel)

        document.getElementById('globalNavPageContentArea').appendChild(dashboard)

    }

}

main()
