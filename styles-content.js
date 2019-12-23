function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

async function makeStyles(stylesOn) {
    if (stylesOn) {

        // let courses = Array.prototype.concat(...Array.from(document.getElementsByClassName('courses')).map(ul => Array.from(ul.children).map(li => { return {
        //     name: li.innerText.trim(), 
        //     link: /['"](.*)['"]/g.exec(li.children[0].attributes.onclick.textContent)[1]
        // }})))

        let courseResponse = await fetch("https://tamu.blackboard.com/webapps/blackboard/execute/globalCourseNavMenuSection?cmd=view&serviceLevel=blackboard.data.course.Course$ServiceLevel:FULL", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0",
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

        let courses = Array.prototype.concat(...Array.from(courseHTML.getElementsByClassName('courses')).map(ul => Array.from(ul.children).map(li => { return {
            name: li.innerText.trim(), 
            link: li.children[0]
        }})))

        let name = document.getElementById('global-nav-link').childNodes[1].nodeValue.trim()

        // Remove listeners

        // Remove header content. Replace with name



    }
}

function onError(error) {
    console.error(error)
}

browser.storage.local.get('style').then(makeStyles, onError)